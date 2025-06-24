<template>
  <section class="chat-room">
    <div class="chat-room-inner">
      <ChatSidebar
          :chatRooms="chatRooms"
          :activeRoomId="activeRoomId"
          @select="selectRoom"
      />

      <InviteView
          v-if="showInviteView"
          :users="availableUsers"
          :invitedUserIds="invitedUserIds"
          :searchQuery="searchQuery"
          @back="closeInviteView"
          @invite="handleUserInvite"
          @search="handleInviteSearch"
      />

      <div class="chat-main" v-else-if="activeRoomId && currentRoom">
        <div class="chat-header">
          <div class="chat-room-name">
            <img class="avatar" :src="currentRoom.avatar" alt="아바타" />
            <span class="nickname">{{ currentRoom.nickname }}</span>
          </div>
          <div class="chat-header-menu" ref="menuContainer">
            <button class="btn-more" @click="toggleMenu">
              <i class="bi bi-three-dots"></i>
            </button>
            <div class="menu-dropdown" v-if="menuOpen" ref="menuDropdown">
              <button class="btn-invite" @click="openInvite">초대하기</button>
              <div class="divider"></div>
              <button class="btn-exit" @click="leaveRoom">나가기</button>
            </div>
          </div>
        </div>

        <div class="chat-content" ref="chatContentRef">
          <div
              class="chat-message"
              v-for="msg in currentRoom.messages"
              :key="msg.id"
          >
            <img class="avatar" :src="msg.avatar" alt="아바타" />
            <div class="message-info">
              <div class="message-top">
                <span class="nickname">{{ msg.nickname }}</span>
                <span class="time">{{ formatDisplayTime(msg.time) }}</span>
              </div>
              <p class="message-text">{{ msg.text }}</p>
            </div>
          </div>
        </div>

        <div class="chat-input-wrap">
          <input
              type="text"
              class="chat-input"
              placeholder="채팅을 입력하세요."
              v-model="input"
              @keyup.enter="sendMessage"
          />
          <button class="btn-send" @click="sendMessage">
            <i class="bi bi-vector-pen"></i>
          </button>
        </div>
      </div>
      
      <div class="chat-main chat-main-placeholder" v-else>
         <div class="placeholder-content">
            <i class="bi bi-chat-dots"></i>
            <p>채팅방을 선택하여 대화를 시작하세요.</p>
         </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ChatSidebar from './ChatSidebar.vue' // 상대 경로로 수정
import InviteView from './InviteView.vue'   // 상대 경로로 수정
import Avatar from '@/assets/img/0.png' // 기본 아바타
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

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

// DOM Refs
const menuContainer = ref(null)
const chatContentRef = ref(null)

// Stomp 관련 상태
const stompClient = ref(null)
const token = ref(null)
const currentUserEmail = ref('')

// 초대 관련 상태
const searchQuery = ref('')
const invitedUserIds = ref([])
const availableUsers = ref([])

// API 기본 URL (환경 변수 사용 권장)
const VUE_APP_API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// ===== Computed 속성 =====
const currentRoom = computed(() =>
    chatRooms.value.find(room => room.id === activeRoomId.value)
)

// ===== Helper 함수 =====
function scrollToBottom() {
  nextTick(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
    }
  })
}

function formatDisplayTime(dateTimeStr) {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  if (isNaN(date)) return '';
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
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
      scrollToBottom();
    }
  } catch (error) {
    console.error("메시지 내역 로딩 실패:", error);
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
        // 현재 보고 있는 방이면 바로 읽음 처리
        axios.post(`${VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/read`, null, {
          headers: { Authorization: `Bearer ${token.value}` }
        });
      } else {
        chat.unread += 1;
      }
    }
    // 목록 순서 최신화 (가장 최근 메시지 온 방을 위로)
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
    scrollToBottom();
  }
}

// ===== UI 관련 함수들 =====
async function sendReadStatus(roomId) {
  if (!roomId) return;
  try {
    // 참고 코드에 있던 API를 호출합니다.
    await axios.post(`${VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/read`, {}, {
        headers: { Authorization: `Bearer ${token.value}` }
    });
    console.log(`✅ [Room ID: ${roomId}] 읽음 상태 전송 성공`);
    
  } catch (error) {
    console.error(`❌ [Room ID: ${roomId}] 읽음 상태 전송 실패:`, error);
  }
}

// 이 채팅방 페이지를 떠나기 직전에 호출되는 네비게이션 가드
onBeforeRouteLeave((to, from, next) => {
//   console.log('채팅 페이지를 떠납니다. 현재 활성화된 방의 읽음 상태를 전송합니다.');
  // 현재 활성화된(보고 있던) 방에 대해서만 읽음 처리를 합니다.
  if (activeRoomId.value) {
    sendReadStatus(activeRoomId.value);
  }
  next(); // 페이지 이동을 계속 진행합니다.
});

async function selectRoom(roomId) {
  // 이미 선택된 방을 다시 누르면 아무것도 하지 않음
  if (activeRoomId.value === roomId) return;
  
  // 다른 방을 선택하기 전에, 이전에 열려있던 방이 있었다면 읽음 처리 API를 먼저 호출
  if (activeRoomId.value) {
    sendReadStatus(activeRoomId.value);
  }

  // 새로운 방을 활성화
  activeRoomId.value = roomId;
  showInviteView.value = false;
  searchQuery.value = '';

  const room = currentRoom.value;
  if(room) {
    // 메시지 내역이 없다면 불러오기
    if (room.messages.length === 0) {
      await fetchMessageHistory(roomId);
    }
  }
  // 스크롤을 맨 아래로
  scrollToBottom();
}

function toggleMenu() { menuOpen.value = !menuOpen.value; }
function handleClickOutside(event) { if (menuOpen.value && menuContainer.value && !menuContainer.value.contains(event.target)) { menuOpen.value = false; } }
function handleEscapeKey(event) { if (event.key === 'Escape') { if (showInviteView.value) closeInviteView(); else if (menuOpen.value) menuOpen.value = false; } }
function openInvite() { menuOpen.value = false; showInviteView.value = true; }
function closeInviteView() { showInviteView.value = false; searchQuery.value = ''; }
function handleInviteSearch(query) { searchQuery.value = query; }
function handleUserInvite(user) { invitedUserIds.value.push(user.id); }
function leaveRoom() { menuOpen.value = false; console.log('채팅방 나가기'); }

// ===== 라이프사이클 훅 =====
onMounted(async () => {
  currentUserEmail.value = localStorage.getItem('email');
  token.value = localStorage.getItem('accessToken');
  if (!token.value || !currentUserEmail.value) { console.error("로그인 정보가 없습니다."); return; }

  await fetchChatRooms();
  if (chatRooms.value.length > 0) { connectWebSocket(); }

  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  disconnectWebSocket();
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
});

</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss"; // scss 변수 파일 임포트

.chat-room-inner {
    display: flex;
    gap: 9px;
}

.chat-main {
    width: 794px;
    height: 778px;
    border: 1px solid $dim-gray;
    border-radius: 15px 15px 0px 0px;
    background: $white;
    display: flex;
    flex-direction: column;
    position: relative;
}

/* 채팅방 선택 안됐을 때 스타일 */
.chat-main-placeholder {
    align-items: center;
    justify-content: center;
    color: $silver-black;
    .placeholder-content {
        text-align: center;
        .bi {
            font-size: 80px;
            margin-bottom: 20px;
        }
        p {
            font-size: 18px;
            font-family: $secondary-kr;
        }
    }
}


/* ==========================================================================
   Chat Header
   ========================================================================== */
.chat-header {
  height: 72px;
  padding: 16px;
  border-bottom: 1px solid $dim-gray;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .chat-room-name {
    display: flex;
    align-items: center;
    gap: 14px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .nickname {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      color: $dark-black;
    }
  }

  .chat-header-menu {
    position: relative;

    .btn-more {
      width: 26px;
      height: 26px;
      background: none;
      border: none;
      cursor: pointer;
      color: $black;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-dropdown {
      position: absolute;
      top: 30px;
      right: -18px;
      width: 64px;
      height: 64px;
      background: $white;
      border: 1px solid $dim-gray;
      border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 10;

      .btn-invite,
      .btn-exit {
        width: 100%;
        padding: 7px;
        background: none;
        border: none;
        font-family: $secondary-kr;
        font-size: 12px;
        color: $black;
        cursor: pointer;
        text-align: center;

        &:hover {
          background-color: rgba($black, 0.05);
        }
      }

      .divider {
        height: 1px;
        background-color: $dim-gray;
        margin: 0 11px;
      }
    }
  }
}

/* ==========================================================================
   Chat Content
   ========================================================================== */
.chat-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 25px;

  .chat-message {
    display: flex;
    gap: 21px;
    align-items: flex-start;

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .message-info {
      flex: 1;

      .message-top {
        display: flex;
        align-items: center;
        gap: 13px;
        margin-bottom: 7px;

        .nickname {
          font-family: $secondary-kr;
          font-weight: 500;
          font-size: 18px;
          color: $dark-black;
        }

        .time {
          font-family: $primary-kr;
          font-size: 12px;
          color: $silver-black;
        }
      }

      .message-text {
        font-family: $primary-kr;
        font-size: 14px;
        color: $dark-black;
        margin: 0;
        word-wrap: break-word;
      }
    }
  }
}

/* ==========================================================================
   Chat Input
   ========================================================================== */
.chat-input-wrap {
  height: 60px;
  border-top: 1px solid $dim-gray;
  background-color: $light-gray;
  display: flex;
  align-items: center;

  .chat-input {
    flex: 1;
    height: 100%;
    border: none;
    background: transparent;
    padding: 20px;
    font-family: $primary-kr;
    font-size: 14px;
    color: $dark-black;
    outline: none;

    &::placeholder {
      color: $silver-black;
    }
  }

  .btn-send {
    width: 60px;
    height: 60px;
    background-color: $main-color;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: darken($main-color, 10%);
    }

    .bi {
      color: $white;
      font-size: 30px;
    }
  }
}
</style>