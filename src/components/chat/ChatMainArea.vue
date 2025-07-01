<template>
  <!-- 채팅방이 선택되고 currentRoom이 있을 때 -->
  <div class="chat-main" v-if="activeRoomId && currentRoom">
    <div class="chat-header">
      <div class="chat-room-user-count">
        <i class="bi bi-person-circle"></i>
        <!-- 그룹 채팅과 개인 채팅 헤더를 분기 처리 -->
        <span v-if="currentRoom?.isGroupChat === 'Y'" class="user-count">{{ userCount || 1 }}</span>
        <span v-else class="private-chat-name">{{ currentRoom.roomName }}</span>
      </div>
      <!-- 그룹 채팅일 경우에만 메뉴 버튼 전체를 보여줍니다. -->
      <div class="chat-header-menu" v-if="currentRoom?.isGroupChat === 'Y'" ref="menuContainer">
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
        <img class="avatar" :src="getProfileImageUrl(msg.avatar || msg.avatarUrl)" alt="아바타" @error="handleImageError" />
        <div class="message-info">
          <div class="message-top">
            <span class="nickname">{{ msg.nickname }}</span>
          </div>
          <p class="message-text">{{ msg.text }}</p>
          <span class="time">{{ formatDisplayTime(msg.time) }}</span>
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
      <!-- 글자 수 카운터 및 전송 버튼을 포함하는 컨테이너 -->
      <div class="input-actions">
        <span class="char-counter" :class="{ 'limit-exceeded': input.length >= 500 }">
          {{ input.length }}/500
        </span>
        <button class="btn-send" @click="sendMessage">
          <i class="bi bi-vector-pen"></i>
        </button>
      </div>
    </div>
  </div>
  
  <!-- 채팅방 선택 안됐을 때 플레이스홀더 -->
  <div class="chat-main chat-main-placeholder" v-else>
     <div class="placeholder-content">
        <i class="bi bi-chat-dots"></i>
        <p>채팅방을 선택하여 대화를 시작하세요.</p>
     </div>
  </div>

  <!-- 나가기 확인 모달 -->
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

  <!-- 글자 수 제한 경고 모달 -->
  <div v-if="showCharLimitModal" class="modal-overlay" @click.self="closeCharLimitModal">
    <div class="modal-content">
      <p class="modal-text">
        500자 이상 입력할 수 없습니다.
      </p>
      <div class="modal-actions">
        <button class="btn-modal btn-confirm" @click="closeCharLimitModal">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, nextTick, onMounted, computed } from 'vue'
import { getProfileImageUrl, handleImageError } from '@/utils/profileImage'

// Props 정의
const props = defineProps({
  activeRoomId: [String, Number],
  currentRoom: Object,
  input: String,
  menuOpen: Boolean,
  userCount: Number,
  currentUserNickname: String
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
const showCharLimitModal = ref(false); // 글자 수 제한 모달 상태

// 유효한 메시지만 렌더링하기 위한 computed 속성
const validMessages = computed(() => {
  if (!props.currentRoom || !props.currentRoom.messages) {
    return [];
  }
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

// 글자 수 제한 모달 닫기 함수
function closeCharLimitModal() {
  showCharLimitModal.value = false;
}

// 입력값 업데이트 및 글자 수 제한 함수
function updateInput(event) {
  let value = event.target.value;
  if (value.length > 500) {
    if (!showCharLimitModal.value) {
        showCharLimitModal.value = true; // 모달이 닫혀있을 때만 띄웁니다.
    }
    value = value.slice(0, 500); // 500자로 잘라냄
  }
  emit('update-input', value);
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

// Watchers
watch(() => props.currentRoom?.messages, () => {
  scrollToBottom()
}, { deep: true })

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
    .bi { font-size: 30px; color:  $silver-black; }
    
    .user-count, .private-chat-name {
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
      width: 26px; height: 26px; background: none; border: none;
      cursor: pointer; color: $black; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
    }

    .menu-dropdown {
      position: absolute;
      top: 30px;
      right: -18px;
      width: 64px;
      background: $white;
      border: 1px solid $dim-gray;
      border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 10;
      overflow: hidden;

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
        &:hover { background-color: rgba($black, 0.05); }
      }
      .divider {
        height: 1px;
        background-color: $dim-gray;
        margin: 0 11px;
      }
    }
  }
}

.chat-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .chat-message {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    max-width: 80%;
    align-self: flex-start;

    .avatar {
      width: 50px; height: 50px;
      border-radius: 50%; object-fit: cover; flex-shrink: 0;
    }

    .message-info {
      display: flex; flex-direction: column; align-items: flex-start;
      
      .message-top {
        margin-bottom: 7px;
        .nickname {
          font-family: $secondary-kr; font-weight: 500;
          font-size: 16px; color: $dark-black;
        }
      }

      .message-text {
        font-family: $primary-kr; font-size: 14px; color: $dark-black;
        margin: 0; word-wrap: break-word;
        padding: 10px 14px; border-radius: 18px;
        background-color: #f1f3f5; line-height: 1.5;
      }
      
      .time {
        font-family: $primary-kr; font-size: 12px;
        color: $silver-black; margin-top: 5px;
      }
    }
    
    &.my-message {
      align-self: flex-end; 
      flex-direction: row-reverse; 

      .message-info {
        align-items: flex-end;
        .message-text {
          background-color: $main-color; 
          color: $white;
        }
      }
    }
  }
}

.chat-input-wrap {
  height: 60px;
  border-top: 1px solid $dim-gray;
  background-color: $light-gray;
  display: flex;
  align-items: center;

  .chat-input {
    flex: 1; height: 100%; border: none; background: transparent;
    padding: 20px; font-family: $primary-kr; font-size: 14px;
    color: $dark-black; outline: none;
    &::placeholder { color: $silver-black; }
  }

  .input-actions {
    display: flex;
    align-items: center;
    padding-right: 5px; // 버튼과의 간격 확보
  }

  .char-counter {
    margin-right: 10px;
    font-size: 12px;
    color: $silver-black;
    white-space: nowrap;

    &.limit-exceeded {
        color: #f03e3e; // 경고 색상
        font-weight: 700;
    }
  }

  .btn-send {
    width: 60px; height: 60px; background-color: $main-color;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    &:hover { background-color: darken($main-color, 10%); }
    .bi { color: $white; font-size: 30px; }
  }
}

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white; padding: 24px; border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center; width: 320px;
}
.modal-text {
  font-size: 16px; margin: 0 0 20px; color: #333; line-height: 1.5;
}
.modal-actions {
  display: flex; justify-content: center; gap: 12px;
}
.btn-modal {
  border: none; padding: 8px 16px; border-radius: 4px;
  font-size: 14px; cursor: pointer; transition: background-color 0.2s;
  min-width: 80px;
}
.btn-confirm {
  background-color: $main-color; color: white;
  &:hover { background-color: darken($main-color, 10%); }
}
.btn-cancel {
  background-color: #f0f0f0; color: #333;
  &:hover { background-color: #e0e0e0; }
}
</style>
