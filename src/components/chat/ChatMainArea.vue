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
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, nextTick, onMounted } from 'vue'

// Props 정의
const props = defineProps({
  activeRoomId: [String, Number],
  currentRoom: Object,
  input: String,
  menuOpen: Boolean,
  userCount: Number,
})

// Emits 정의  
const emit = defineEmits([
  'update-input',
  'send-message', 
  'toggle-menu',
  'open-invite',
  'leave-room',
  'open-List'
])

// DOM Refs
const menuContainer = ref(null)
const chatContentRef = ref(null)

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

// 이벤트 핸들러들
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

function leaveRoom() {
  emit('leave-room')
}
function openList() {
  emit('open-List')
}

// currentRoom의 messages가 변경될 때 스크롤 이동
watch(() => props.currentRoom?.messages, () => {
  scrollToBottom()
}, { deep: true })

// activeRoomId가 변경될 때와 컴포넌트가 다시 마운트될 때도 스크롤 이동
watch(() => props.activeRoomId, () => {
  scrollToBottom()
})

// showInviteView에서 돌아올 때를 감지하기 위해 컴포넌트 마운트 시에도 스크롤
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