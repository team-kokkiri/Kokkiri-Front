<template>
  <div class="page-container">
    <section class="chat-room">
      <div class="chat-room-inner">
        <ChatSidebar
            :chat-rooms="chatRooms"
            :active-room-id="activeRoomId"
            :is-loading="isLoading"
            :has-more="hasMore"
            @select="selectRoom"
            @create="createRoom"
            @load-more="fetchMoreChatRooms"
        />

        <ChatUserList
            v-if="showUserListView"
            :users="roomUsers"
            :search-query="userListSearchQuery"
            :is-loading="isMemberLoading"
            :has-more="hasMoreMembers"
            @back="closeUserListView"
            @search="handleUserListSearch"
            @load-more="fetchMoreMembers"
        />

        <InviteView
            v-else-if="showInviteView"
            :room-id="activeRoomId"
            :invited-user-ids="invitedUserIds"
            :search-query="inviteSearchQuery"
            @back="closeInviteView"
            @invite="handleUserInvite"
            @search="handleInviteSearch"
        />

        <ChatMainArea
            v-else
            :active-room-id="activeRoomId"
            :current-room="currentRoom"
            :input="input"
            :menu-open="menuOpen"
            :userCount="userCount"
            @update-input="updateInput"
            @send-message="sendMessage"
            @toggle-menu="toggleMenu"
            @open-invite="openInvite"
            @leave-room="handleLeaveRoom"
            @open-user-list="openList"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
// 컴포넌트 임포트
import ChatSidebar from '@/components/chat/ChatSidebar.vue';
import InviteView from '@/components/chat/InviteView.vue';
import ChatMainArea from '@/components/chat/ChatMainArea.vue';
import ChatUserList from '@/components/chat/ChatUserList.vue';

// 유틸 및 라이브러리 임포트
import Avatar from '@/assets/img/0.png';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'; // ✨ watch 임포트 추가
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import axios from 'axios';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

// ===== 상태(State) 관리 =====

// 채팅방 및 메시지 관련
const chatRooms = ref([]);
const activeRoomId = ref(null);
const input = ref('');
const menuOpen = ref(false);

// 채팅방 목록 페이징 관련
const page = ref(0);
const isLoading = ref(false);
const hasMore = ref(true);

// Stomp 및 인증 관련
const stompClient = ref(null);
const token = ref(null);
const currentUserEmail = ref('');

// 초대 관련
const showInviteView = ref(false);
const inviteSearchQuery = ref('');
const invitedUserIds = ref([]);

// 유저 목록 관련
const showUserListView = ref(false);
const roomUsers = ref([]);
const userListSearchQuery = ref('');
const userCount = ref(0);
const memberPage = ref(0);
const isMemberLoading = ref(false);
const hasMoreMembers = ref(true);
let searchDebounceTimer = null;

const route = useRoute();
const VUE_APP_API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090';

// ===== Computed 속성 =====
const currentRoom = computed(() =>
    chatRooms.value.find(room => room.roomId === activeRoomId.value)
);

// ===== 함수 =====

function createRoom() {
  console.log("새 채팅방 생성 로직 구현 필요");
}

// 채팅방 멤버 목록 API 호출 함수
async function fetchChatRoomMembers(roomId, query, pageNum) {
  if (!roomId) return null;
  isMemberLoading.value = true;
  try {
    const response = await axios.get(`${VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/members`, {
      headers: { Authorization: `Bearer ${token.value}` },
      params: { nickname: query, page: pageNum, size: 20 }
    });
    return response.data;
  } catch (error) {
    console.error("채팅방 유저 목록 로딩 실패:", error);
    return null;
  } finally {
    isMemberLoading.value = false;
  }
}

//  멤버 목록을 더 불러오는 함수 (무한 스크롤)
async function fetchMoreMembers() {
  if (isMemberLoading.value || !hasMoreMembers.value) return;

  const data = await fetchChatRoomMembers(activeRoomId.value, userListSearchQuery.value, memberPage.value);

  if (data && data.content) {
    if (memberPage.value === 0) {
      roomUsers.value = data.content.map(user => ({ ...user, avatar: user.avatarUrl || Avatar }));
    } else {
      roomUsers.value.push(...data.content.map(user => ({ ...user, avatar: user.avatarUrl || Avatar })));
    }
    hasMoreMembers.value = !data.last;
    userCount.value = data.totalElements;
    if (hasMoreMembers.value) {
      memberPage.value++;
    }
  } else {
    hasMoreMembers.value = false;
  }
}

// 유저 목록 보기 (초기화 및 첫 페이지 로딩)
async function openList() {
  if (!activeRoomId.value) {
    alert("유저 목록을 보려면 채팅방을 먼저 선택해주세요.");
    return;
  }
  menuOpen.value = false;
  
  userListSearchQuery.value = '';
  memberPage.value = 0;
  hasMoreMembers.value = true;
  roomUsers.value = [];
  
  showUserListView.value = true;
  await fetchMoreMembers();
}

function closeUserListView() { showUserListView.value = false; }
function handleUserListSearch(query) { userListSearchQuery.value = query; }

// 검색어가 변경되면 디바운싱 후 멤버 목록을 다시 불러옴
watch(userListSearchQuery, () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(async () => {
    memberPage.value = 0;
    hasMoreMembers.value = true;
    roomUsers.value = [];
    await fetchMoreMembers();
  }, 300);
});

async function selectRoom(roomId) {
  if (activeRoomId.value === roomId) return;
  
  activeRoomId.value = roomId;
  showInviteView.value = false;
  showUserListView.value = false;
  inviteSearchQuery.value = '';
  userListSearchQuery.value = '';

  const room = chatRooms.value.find(r => r.roomId === roomId);
  if (room) {
    if (room.unReadCount > 0) {
      room.unReadCount = 0;
      await sendReadStatus(roomId);
    }
    if (room.messages.length === 0) {
      await fetchMessageHistory(roomId);
    }
    // 방을 선택할 때마다 멤버 수를 다시 불러옵니다.
    const memberData = await fetchChatRoomMembers(roomId, '', 0);
    if(memberData) userCount.value = memberData.totalElements;
  }
}

async function handleLeaveRoom() {
  if (!activeRoomId.value) return;
  
  try {
    await axios.delete(`${VUE_APP_API_BASE_URL}/api/chat/room/group/${activeRoomId.value}/leave`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const leftRoomId = activeRoomId.value;
    chatRooms.value = chatRooms.value.filter(room => room.roomId !== leftRoomId);
    activeRoomId.value = null;
  } catch (error) {
    console.error("채팅방 나가기 실패:", error);
    alert("채팅방을 나가는 데 실패했습니다.");
  }
}

async function fetchChatRooms() {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  try {
    const response = await axios.get(`${VUE_APP_API_BASE_URL}/api/chat/myRooms`, {
      headers: { Authorization: `Bearer ${token.value}` },
      params: { page: page.value, size: 20 }
    });
    const data = response.data;
    const newRooms = data.content.map(room => ({
      roomId: room.roomId, avatar: Avatar, roomName: room.roomName,
      lastMessageTime: room.lastMessageTime, lastMessage: room.lastMessage,
      unReadCount: room.unReadCount, messages: []
    }));
    chatRooms.value.push(...newRooms);
    hasMore.value = !data.last;
    if (hasMore.value) page.value++;
    if (stompClient.value?.connected) subscribeToRooms(newRooms);
  } catch (error) {
    console.error("채팅방 목록 로딩 실패:", error);
  } finally {
    isLoading.value = false;
  }
}

function fetchMoreChatRooms() { fetchChatRooms(); }

async function fetchMessageHistory(roomId) {
  try {
    const res = await axios.get(`${VUE_APP_API_BASE_URL}/api/chat/history/${roomId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const room = chatRooms.value.find(r => r.roomId === roomId);
    if (room) {
      room.messages = res.data.map(msg => ({
        id: msg.id, avatar: Avatar, nickname: msg.senderEmail, time: msg.createdTime, text: msg.message
      }));
    }
  } catch (error) { console.error("메시지 내역 로딩 실패:", error); }
}

function subscribeToRooms(roomsToSubscribe) {
  if (!stompClient.value?.connected) return;
  roomsToSubscribe.forEach(chat => {
    stompClient.value.subscribe(`/topic/${chat.roomId}`, 
      (message) => handleIncomingMessage(JSON.parse(message.body)),
      { id: `sub-${chat.roomId}`, Authorization: `Bearer ${token.value}` }
    );
  });
}

function connectWebSocket() {
  if (stompClient.value?.connected) return;
  const sockJs = new SockJS(`${VUE_APP_API_BASE_URL}/connect`);
  stompClient.value = Stomp.over(sockJs);
  stompClient.value.debug = () => {};
  stompClient.value.connect({ Authorization: `Bearer ${token.value}` }, () => {
    subscribeToRooms(chatRooms.value);
  });
}

function disconnectWebSocket() {
  if (stompClient.value?.connected) stompClient.value.disconnect();
}

function sendMessage() {
  if (input.value.trim() === '' || !activeRoomId.value || !stompClient.value?.connected) return;
  const payload = { senderEmail: currentUserEmail.value, message: input.value };
  stompClient.value.send(`/publish/${activeRoomId.value}`, JSON.stringify(payload), {
    Authorization: `Bearer ${token.value}`
  });
  input.value = '';
}

function handleIncomingMessage(msg) {
  const { roomId, senderEmail, message, createdTime } = msg;
  const chatIndex = chatRooms.value.findIndex(c => c.roomId === roomId);
  if (chatIndex !== -1) {
    const chat = chatRooms.value[chatIndex];
    chat.lastMessage = message;
    chat.lastMessageTime = createdTime;
    if (senderEmail !== currentUserEmail.value) {
      if (roomId === activeRoomId.value) {
        axios.post(`${VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/read`, null, {
          headers: { Authorization: `Bearer ${token.value}` }
        });
      } else {
        chat.unReadCount += 1;
      }
    }
    chatRooms.value.splice(chatIndex, 1);
    chatRooms.value.unshift(chat);
  }
  if (roomId === activeRoomId.value) {
    currentRoom.value.messages.push({
      id: Date.now(), avatar: Avatar, nickname: senderEmail, time: createdTime, text: message
    });
  }
}

async function sendReadStatus(roomId) {
  if (!roomId) return;
  try {
    await axios.post(`${VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/read`, {}, {
        headers: { Authorization: `Bearer ${token.value}` }
    });
  } catch (error) { console.error(`❌ [Room ID: ${roomId}] 읽음 상태 전송 실패:`, error); }
}

onBeforeRouteLeave((to, from, next) => {
  if (activeRoomId.value) sendReadStatus(activeRoomId.value);
  next();
});

function updateInput(newValue) { input.value = newValue; }
function toggleMenu() { menuOpen.value = !menuOpen.value; }
function openInvite() { 
  if (!activeRoomId.value) {
    alert("초대할 채팅방을 먼저 선택해주세요.");
    return;
  }
  menuOpen.value = false; 
  showInviteView.value = true; 
}

function handleEscapeKey(event) { 
  if (event.key === 'Escape') { 
    if (showUserListView.value) closeUserListView();
    else if (showInviteView.value) closeInviteView(); 
    else if (menuOpen.value) menuOpen.value = false; 
  } 
}
function closeInviteView() { showInviteView.value = false; inviteSearchQuery.value = ''; }
function handleInviteSearch(query) { inviteSearchQuery.value = query; }
function handleUserInvite(user) { invitedUserIds.value.push(user.memberId); }


// ===== 생명주기 훅 =====
onMounted(async () => {
  currentUserEmail.value = localStorage.getItem('email');
  token.value = localStorage.getItem('accessToken');
  if (!token.value || !currentUserEmail.value) { 
    console.error("로그인 정보가 없습니다."); 
    return; 
  }

  await fetchChatRooms();
  if (chatRooms.value.length > 0) connectWebSocket(); 

  const targetRoomId = route.query.roomId;
  if (targetRoomId) {
    const roomIdAsNumber = parseInt(targetRoomId, 10);
    const roomExists = chatRooms.value.some(room => room.roomId === roomIdAsNumber);
    if (roomExists) {
      await selectRoom(roomIdAsNumber);
    } else {
      console.warn(`URL의 채팅방 ID(${roomIdAsNumber})가 현재 사용자의 채팅 목록에 없습니다.`);
    }
  }

  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  disconnectWebSocket();
  document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";
.page-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.chat-room-inner {
    display: flex;
    gap: 9px;
}
</style>