<template>
  <!-- 채팅방이 선택되고 currentRoom이 있을 때 -->
  <div class="chat-main" v-if="activeRoomId && currentRoom">
    <div class="chat-header">
      <div class="chat-room-user-count">
        <i class="bi bi-person-circle"></i>
        <span class="user-count">{{ userCount || 1 }}</span>
      </div>
      <div class="chat-header-menu" ref="menuContainer">
        <button class="btn-more" @click="toggleMenu">
          <i class="bi bi-three-dots"></i>
        </button>
        <div class="menu-dropdown" v-if="menuOpen" ref="menuDropdown">
          <button class="btn-invite" @click="openInvite">초대하기</button>
          <div class="divider"></div>
          <button class="btn-invite" @click="openList">유저목록</button>
          <div class="divider"></div>
          <button class="btn-exit" @click="leaveRoom">나가기</button>
        </div>
      </div>
    </div>

    <div class="chat-content" ref="chatContentRef">
      <!-- 유효한 메시지만 순회하도록 computed 속성 사용 -->
      <div
          class="chat-message"
          v-for="msg in validMessages"
          :key="msg.id"
          :class="{ 'my-message': msg.nickname === currentUserNickname }"
      >
        <img class="avatar" :src="msg.avatar" alt="아바타" />
        <div class="message-info">
          <div class="message-top">
            <!-- 옵셔널 체이닝(?.)을 사용하여 데이터가 없어도 오류가 나지 않도록 합니다. -->
            <span class="nickname">{{ msg?.nickname }}</span>
          </div>
          <p class="message-text">{{ msg?.text }}</p>
          <span class="time">{{ formatDisplayTime(msg?.time) }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input-wrap">
      <input
          type="text"
          class="chat-input"
          placeholder="채팅을 입력하세요."
          :value="input"
          @input="updateInput"
          @keyup.enter="sendMessage"
      />
      <button class="btn-send" @click="sendMessage">
        <i class="bi bi-vector-pen"></i>
      </button>
    </div>
  </div>
  
  <!-- 채팅방 선택 안됐을 때 플레이스홀더 -->
  <div class="chat-main chat-main-placeholder" v-else>
     <div class="placeholder-content">
        <i class="bi bi-chat-dots"></i>
        <p>채팅방을 선택하여 대화를 시작하세요.</p>
     </div>
  </div>

  <div v-if="showLeaveModal" class="modal-overlay" @click.self="closeLeaveModal">
    <div class="modal-content">
      <p class="modal-text">
        <strong v-if="currentRoom">'{{ currentRoom.roomName }}'</strong> 채팅방을 나가시겠습니까?
      </p>
      <div class="modal-actions">
        <button class="btn-modal btn-confirm" @click="confirmLeave">네</button>
        <button class="btn-modal btn-cancel" @click="closeLeaveModal">아니오</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, nextTick, onMounted, computed } from 'vue'

// NOTE:
// 1. 이 컴포넌트가 올바르게 동작하려면, 부모 컴포넌트에서 `currentUserNickname` prop으로
//    현재 로그인한 사용자의 닉네임을 정확히 전달해야 합니다.
// 2. 부모에서 내려주는 `currentRoom.messages` 배열의 각 메시지 객체(msg)는
//    `nickname`, `text`, `time` 등의 속성을 포함해야 합니다.

// Props 정의
const props = defineProps({
  activeRoomId: [String, Number],
  currentRoom: Object,
  input: String,
  menuOpen: Boolean,
  userCount: Number,
  currentUserNickname: String // 현재 사용자 닉네임을 받기 위한 prop
})

// Emits 정의  
const emit = defineEmits([
  'update-input',
  'send-message', 
  'toggle-menu',
  'open-invite',
  'leave-room',
  'open-user-list'
])

// DOM Refs
const menuContainer = ref(null)
const chatContentRef = ref(null)

// 모달 상태 관리를 위한 ref
const showLeaveModal = ref(false);

// v-if와 v-for를 함께 사용하는 것을 방지하기 위한 computed 속성
const validMessages = computed(() => {
  if (!props.currentRoom || !props.currentRoom.messages) {
    return [];
  }
  // 유효한 메시지(msg 객체, nickname, text 속성이 모두 있는 경우)만 필터링합니다.
  return props.currentRoom.messages.filter(msg => msg && msg.nickname && msg.text !== undefined);
});


// Helper 함수들
function formatDisplayTime(dateTimeStr) {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  if (isNaN(date)) return '';
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
    }
  })
}

function leaveRoom() {
  showLeaveModal.value = true;
}

function closeLeaveModal() {
  showLeaveModal.value = false;
}

function confirmLeave() {
  emit('leave-room');
  closeLeaveModal();
}


function updateInput(event) {
  emit('update-input', event.target.value)
}

function sendMessage() {
  emit('send-message')
}

function toggleMenu() {
  emit('toggle-menu')
}

function openInvite() {
  emit('open-invite')
}

function openList() {
  emit('open-user-list') 
}

// currentRoom 데이터가 변경될 때 로그를 출력하여 디버깅을 돕습니다.
watch(() => props.currentRoom, (newRoom) => {
  console.log("[ChatMainArea] currentRoom 데이터 변경:", newRoom);
  if (newRoom && newRoom.messages) {
    console.log("[ChatMainArea] 수신된 메시지 목록:", newRoom.messages);
  }
  scrollToBottom();
}, { deep: true });


// activeRoomId가 변경될 때도 스크롤을 맨 아래로 이동시킵니다.
watch(() => props.activeRoomId, () => {
  scrollToBottom()
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

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

  .chat-room-user-count {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;

    .bi {
      font-size: 30px;
      object-fit: cover;
      color:  $silver-black;
    }

    .user-count {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      color: $dark-black;
      margin-top: 5px;
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
      height: 98px;
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
  gap: 15px; // 메시지 간격 조정

  .chat-message {
    display: flex;
    gap: 12px;
    align-items: flex-end; // 시간 때문에 하단 정렬로 변경
    max-width: 80%; // 메시지 최대 너비 설정
    align-self: flex-start; // 기본은 왼쪽 정렬

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .message-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start; // 기본은 텍스트 왼쪽 정렬
      
      .message-top {
        margin-bottom: 7px;

        .nickname {
          font-family: $secondary-kr;
          font-weight: 500;
          font-size: 16px; 
          color: $dark-black;
        }
      }

      .message-text {
        font-family: $primary-kr;
        font-size: 14px;
        color: $dark-black;
        margin: 0;
        word-wrap: break-word;
        padding: 10px 14px;
        border-radius: 18px;
        background-color: #f1f3f5; 
        line-height: 1.5;
      }
      
      .time {
        font-family: $primary-kr;
        font-size: 12px;
        color: $silver-black;
        margin-top: 5px; // 메시지 버블과의 간격
      }
    }
    
    // --- 내가 보낸 메시지에 대한 스타일 ---
    &.my-message {
      align-self: flex-end; 
      flex-direction: row-reverse; 

      .message-info {
        align-items: flex-end;
        .message-top {
          // 닉네임은 보통 본인 메시지에서는 숨기지만, 일단 유지
        }
        .message-text {
          background-color: $main-color; 
          color: $white;
        }
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 320px;
}
.modal-text {
  font-size: 16px;
  margin: 0 0 20px;
  color: #333;
  line-height: 1.5;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.btn-modal {
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 80px;
}
.btn-confirm {
  background-color: $main-color;
  color: white;
  &:hover {
    background-color: darken($main-color, 10%);
  }
}
.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
}
</style>
