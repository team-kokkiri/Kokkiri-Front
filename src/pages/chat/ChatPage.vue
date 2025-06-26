<template>
  <div class="page-container">
    <section class="chat-room">
      <div class="chat-room-inner">
        <!-- 1. 채팅 사이드바 컴포넌트 -->
        <ChatSidebar
            :chatRooms="chatRooms"
            :activeRoomId="activeRoomId"
            @select="selectRoom"
            @create="createRoom"
        />

        <!-- 2. 유저목록 뷰 컴포넌트 (조건부 렌더링) -->
        <ChatUserList
            v-if="showUserListView"
            :users="roomUsers"
            :searchQuery="userListSearchQuery"
            @back="closeUserListView"
            @search="handleUserListSearch"
        />

        <!-- 3. 초대 뷰 컴포넌트 (조건부 렌더링) -->
        <InviteView
            v-else-if="showInviteView"
            :users="availableUsers"
            :invitedUserIds="invitedUserIds"
            :searchQuery="searchQuery"
            @back="closeInviteView"
            @invite="handleUserInvite"
            @search="handleInviteSearch"
        />

        <!-- 4. 채팅룸 메인 영역 컴포넌트 (다른 뷰가 아닐 때만 표시) -->
        <ChatMainArea
            v-else
            :activeRoomId="activeRoomId"
            :currentRoom="currentRoom"
            :input="input"
            :menuOpen="menuOpen"
            :userCount="userCount"
            @update-input="updateInput"
            @send-message="sendMessage"
            @toggle-menu="toggleMenu"
            @open-invite="openInvite"
            @leave-room="leaveRoom"
            @open-list="openList"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
// 컴포넌트 임포트
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import InviteView from '@/components/chat/InviteView.vue'
import ChatMainArea from '@/components/chat/ChatMainArea.vue'
import ChatUserList from '@/components/chat/ChatUserList.vue' // 새로 추가
import Avatar from '@/assets/img/0.png' // 기본 아바타
import { ref, computed, onMounted, onUnmounted} from 'vue'

// Stomp 및 통신 라이브러리 import
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import axios from 'axios'

import { onBeforeRouteLeave } from 'vue-router'

// ===== 상태(State) 관리 =====
const chatRooms = ref([])
const activeRoomId = ref(null)
const input = ref('')
const menuOpen = ref(false)
const showInviteView = ref(false)
const showUserListView = ref(false) // 새로 추가

// Stomp 관련 상태
const stompClient = ref(null)
const token = ref(null)
const currentUserEmail = ref('')

// 초대 관련 상태
const searchQuery = ref('')
const invitedUserIds = ref([])
const availableUsers = ref([])

// 유저목록 관련 상태 (새로 추가)
const userListSearchQuery = ref('')
const roomUsers = ref([])

// 유저 목록 수
const userCount = ref(5)

// API 기본 URL (환경 변수 사용 권장)
const VUE_APP_API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// ===== Computed 속성 =====
const currentRoom = computed(() =>
    chatRooms.value.find(room => room.id === activeRoomId.value)
)

// ===== Helper 함수 =====
function formatDisplayTime(dateTimeStr) {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  if (isNaN(date)) return '';
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// 채팅창 생성하기!!
function createRoom() {

}

// ===== 채팅 및 WebSocket 관련 함수 =====
async function fetchChatRooms() {
  try {
    const response = await axios.get(`${VUE_APP_API_BASE_URL}/api/chat/myRooms`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    chatRooms.value = response.data.map(room => ({
      id: room.roomId,
      avatar: Avatar,
      nickname: room.roomName,
      time: formatDisplayTime(room.lastMessageTime),
      preview: room.lastMessage,
      unread: room.unReadCount,
      messages: []
    }));
  } catch (error) {
    console.error("채팅방 목록 로딩 실패:", error);
  }
}

async function fetchMessageHistory(roomId) {
  try {
    const res = await axios.get(`${VUE_APP_API_BASE_URL}/api/chat/history/${roomId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const room = chatRooms.value.find(r => r.id === roomId);
    if (room) {
      room.messages = res.data.map(msg => ({
        id: msg.id,
        avatar: Avatar,
        nickname: msg.senderEmail,
        time: msg.createdTime,
        text: msg.message
      }));
    }
  } catch (error) {
    console.error("메시지 내역 로딩 실패:", error);
  }
}

// 채팅방 유저 목록 가져오기 (새로 추가)
async function fetchRoomUsers(roomId) {
  try {
    const response = await axios.get(`${VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/users`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    roomUsers.value = response.data.map(user => ({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      avatar: user.avatar || Avatar
    }));
  } catch (error) {
    console.error("채팅방 유저 목록 로딩 실패:", error);
    // 실패 시 빈 배열로 설정
    roomUsers.value = [];
  }
}

function connectWebSocket() {
  if (stompClient.value && stompClient.value.connected) return;
  const sockJs = new SockJS(`${VUE_APP_API_BASE_URL}/connect`);
  stompClient.value = Stomp.over(sockJs);
  stompClient.value.debug = () => {};

  stompClient.value.connect({ Authorization: `Bearer ${token.value}` }, () => {
    chatRooms.value.forEach(chat => {
      stompClient.value.subscribe(`/topic/${chat.id}`,
          (message) => handleIncomingMessage(JSON.parse(message.body)),
          { Authorization: `Bearer ${token.value}` }
      );
    });
  });
}

function disconnectWebSocket() {
  if (stompClient.value && stompClient.value.connected) {
    stompClient.value.disconnect();
  }
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
  const chatIndex = chatRooms.value.findIndex(c => c.id === roomId);

  if (chatIndex !== -1) {
    const chat = chatRooms.value[chatIndex];
    chat.preview = message;
    chat.time = formatDisplayTime(createdTime);
    if (senderEmail !== currentUserEmail.value) {
      if (roomId === activeRoomId.value) {
        axios.post(`${VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/read`, null, {
          headers: { Authorization: `Bearer ${token.value}` }
        });
      } else {
        chat.unread += 1;
      }
    }
    chatRooms.value.splice(chatIndex, 1);
    chatRooms.value.unshift(chat);
  }

  if (roomId === activeRoomId.value) {
    currentRoom.value.messages.push({
      id: Date.now(),
      avatar: Avatar,
      nickname: senderEmail,
      time: createdTime,
      text: message
    });
  }
}

// ===== UI 관련 함수들 =====
async function sendReadStatus(roomId) {
  if (!roomId) return;
  try {
    await axios.post(`${VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/read`, {}, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    console.log(`✅ [Room ID: ${roomId}] 읽음 상태 전송 성공`);

  } catch (error) {
    console.error(`❌ [Room ID: ${roomId}] 읽음 상태 전송 실패:`, error);
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (activeRoomId.value) {
    sendReadStatus(activeRoomId.value);
  }
  next();
});

async function selectRoom(roomId) {
  if (activeRoomId.value === roomId) return;

  activeRoomId.value = roomId;
  showInviteView.value = false;
  showUserListView.value = false; // 추가
  searchQuery.value = '';
  userListSearchQuery.value = ''; // 추가

  const room = chatRooms.value.find(r => r.id === roomId);

  if (room) {
    if (room.unread > 0) {
      room.unread = 0;
      sendReadStatus(roomId);
    }

    if (room.messages.length === 0) {
      await fetchMessageHistory(roomId);
    }
  }
}

// ===== ChatMainArea에서 emit되는 이벤트 핸들러들 =====
function updateInput(newValue) {
  input.value = newValue;
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function openInvite() {
  menuOpen.value = false;
  showInviteView.value = true;
  showUserListView.value = false; // 추가
}

function leaveRoom() {
  menuOpen.value = false;
  console.log('채팅방 나가기');
}

// 유저목록 열기 (새로 구현)
async function openList() {
  if (!activeRoomId.value) {
    console.warn('활성화된 채팅방이 없습니다.');
    return;
  }

  menuOpen.value = false;
  showInviteView.value = false;
  showUserListView.value = true;
  userListSearchQuery.value = '';

  // 채팅방 유저 목록 가져오기
  await fetchRoomUsers(activeRoomId.value);
}

// ===== 기타 UI 관련 함수들 =====
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    if (showUserListView.value) closeUserListView();
    else if (showInviteView.value) closeInviteView();
    else if (menuOpen.value) menuOpen.value = false;
  }
}

function closeInviteView() {
  showInviteView.value = false;
  searchQuery.value = '';
}

// 유저목록 뷰 닫기 (새로 추가)
function closeUserListView() {
  showUserListView.value = false;
  userListSearchQuery.value = '';
}

function handleInviteSearch(query) {
  searchQuery.value = query;
}

// 유저목록 검색 핸들러 (새로 추가)
function handleUserListSearch(query) {
  userListSearchQuery.value = query;
}

function handleUserInvite(user) {
  invitedUserIds.value.push(user.id);
}

// ===== 라이프사이클 훅 =====
onMounted(async () => {
  currentUserEmail.value = localStorage.getItem('email');
  token.value = localStorage.getItem('accessToken');
  if (!token.value || !currentUserEmail.value) {
    console.error("로그인 정보가 없습니다.");
    return;
  }

  await fetchChatRooms();
  if (chatRooms.value.length > 0) { connectWebSocket(); }

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