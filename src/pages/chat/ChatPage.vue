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
            @load-more="fetchMoreChatRooms"
        />

        <InviteView
            v-if="showInviteView"
            :room-id="activeRoomId"
            :invited-user-ids="invitedUserIds"
            :search-query="searchQuery"
            @back="closeInviteView"
            @invite="handleUserInvite"
            @search="handleInviteSearch"
        />

        <ChatMainArea
            v-if="!showInviteView"
            :active-room-id="activeRoomId"
            :current-room="currentRoom"
            :input="input"
            :menu-open="menuOpen"
            @update-input="updateInput"
            @send-message="sendMessage"
            @toggle-menu="toggleMenu"
            @open-invite="openInvite"
            @leave-room="leaveRoom"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
// 4개 컴포넌트 임포트
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import InviteView from '@/components/chat/InviteView.vue'
import ChatMainArea from '@/components/chat/ChatMainArea.vue'
import Avatar from '@/assets/img/0.png' // 기본 아바타
import { ref, computed, onMounted, onUnmounted} from 'vue'

// Stomp 및 통신 라이브러리 import
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import axios from 'axios'

// ✨ useRoute import 추가
import { onBeforeRouteLeave, useRoute } from 'vue-router'

// ===== 상태(State) 관리 =====
const chatRooms = ref([])
const activeRoomId = ref(null)
const input = ref('')
const menuOpen = ref(false)
const showInviteView = ref(false)

// 페이징 상태 관리 변수 추가
const page = ref(0)
const isLoading = ref(false)
const hasMore = ref(true)

// Stomp 관련 상태
const stompClient = ref(null)
const token = ref(null)
const currentUserEmail = ref('')

// 초대 관련 상태
const searchQuery = ref('')
const invitedUserIds = ref([])

// ✨ route 객체 생성
const route = useRoute();

// API 기본 URL (환경 변수 사용 권장)
const VUE_APP_API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090';

// ===== Computed 속성 =====
const currentRoom = computed(() =>
    chatRooms.value.find(room => room.roomId === activeRoomId.value)
)

// ===== 채팅 및 WebSocket 관련 함수 =====
async function fetchChatRooms() {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const response = await axios.get(`${VUE_APP_API_BASE_URL}/api/chat/myRooms`, {
      headers: { Authorization: `Bearer ${token.value}` },
      params: {
        page: page.value,
        size: 20
      }
    });
    
    const data = response.data;
    const newRooms = data.content.map(room => ({
      roomId: room.roomId,
      avatar: Avatar,
      roomName: room.roomName,
      lastMessageTime: room.lastMessageTime,
      lastMessage: room.lastMessage,
      unReadCount: room.unReadCount,
      messages: []
    }));

    chatRooms.value.push(...newRooms);
    hasMore.value = !data.last;
    
    if (hasMore.value) {
      page.value++;
    }
    
    if (stompClient.value && stompClient.value.connected) {
      subscribeToRooms(newRooms);
    }

  } catch (error) {
    console.error("채팅방 목록 로딩 실패:", error);
  } finally {
    isLoading.value = false;
  }
}

function fetchMoreChatRooms() {
  fetchChatRooms();
}

async function fetchMessageHistory(roomId) {
  try {
    const res = await axios.get(`${VUE_APP_API_BASE_URL}/api/chat/history/${roomId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const room = chatRooms.value.find(r => r.roomId === roomId);
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

function subscribeToRooms(roomsToSubscribe) {
  if (!stompClient.value?.connected) return;

  roomsToSubscribe.forEach(chat => {
    stompClient.value.subscribe(`/topic/${chat.roomId}`, 
      (message) => handleIncomingMessage(JSON.parse(message.body)),
      { 
        id: `sub-${chat.roomId}`,
        Authorization: `Bearer ${token.value}`
      }
    );
  });
}

function connectWebSocket() {
  if (stompClient.value && stompClient.value.connected) return;

  const sockJs = new SockJS(`${VUE_APP_API_BASE_URL}/connect`);
  stompClient.value = Stomp.over(sockJs);
  stompClient.value.debug = () => {};

  stompClient.value.connect({ Authorization: `Bearer ${token.value}` }, () => {
    subscribeToRooms(chatRooms.value);
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
      id: Date.now(),
      avatar: Avatar,
      nickname: senderEmail,
      time: createdTime,
      text: message
    });
  }
}

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
  searchQuery.value = '';
  const room = chatRooms.value.find(r => r.roomId === roomId);
  if (room) {
    if (room.unReadCount > 0) {
      room.unReadCount = 0;
      sendReadStatus(roomId);
    }
    if (room.messages.length === 0) {
      await fetchMessageHistory(roomId);
    }
  }
}

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
function leaveRoom() { 
  menuOpen.value = false; 
  console.log('채팅방 나가기'); 
}
function handleEscapeKey(event) { 
  if (event.key === 'Escape') { 
    if (showInviteView.value) closeInviteView(); 
    else if (menuOpen.value) menuOpen.value = false; 
  } 
}
function closeInviteView() { showInviteView.value = false; searchQuery.value = ''; }
function handleInviteSearch(query) { searchQuery.value = query; }
function handleUserInvite(user) { invitedUserIds.value.push(user.memberId); }

// ✨ onMounted 훅 수정
onMounted(async () => {
  // 1. 기본 정보 설정
  currentUserEmail.value = localStorage.getItem('email');
  token.value = localStorage.getItem('accessToken');
  if (!token.value || !currentUserEmail.value) { 
    console.error("로그인 정보가 없습니다."); 
    return; 
  }

  // 2. 채팅방 목록을 먼저 모두 불러옵니다.
  await fetchChatRooms();

  // 3. 웹소켓 연결
  if (chatRooms.value.length > 0) { 
    connectWebSocket(); 
  }

  // 4. ✨ URL에서 roomId를 확인하고 해당 채팅방을 자동으로 선택합니다.
  const targetRoomId = route.query.roomId;
  if (targetRoomId) {
    // URL의 쿼리 파라미터는 문자열이므로 숫자로 변환합니다.
    const roomIdAsNumber = parseInt(targetRoomId, 10);
    
    // 불러온 채팅 목록에 해당 ID가 있는지 확인합니다.
    const roomExists = chatRooms.value.some(room => room.roomId === roomIdAsNumber);

    if (roomExists) {
      console.log(`URL에서 채팅방 ID(${roomIdAsNumber})를 감지하여 자동으로 선택합니다.`);
      // selectRoom 함수를 호출하여 채팅방을 활성화합니다.
      await selectRoom(roomIdAsNumber);
    } else {
      console.warn(`URL의 채팅방 ID(${roomIdAsNumber})가 현재 사용자의 채팅 목록에 없습니다.`);
    }
  }

  // 5. 키보드 이벤트 리스너 추가
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