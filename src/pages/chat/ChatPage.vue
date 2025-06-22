<template>
  <section class="chat-room">
    <div class="chat-room-inner">
      <!-- 좌측: 채팅방 목록(컴포넌트) -->
      <ChatSidebar
          :chatRooms="chatRooms"
          :activeRoomId="activeRoomId"
          @select="selectRoom"
      />

      <!-- 우측: 채팅 메인 -->
      <div class="chat-main">
        <!-- 상단 헤더 -->
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
        <!-- 채팅 메시지 목록 -->
        <div class="chat-content">
          <div
              class="chat-message"
              v-for="msg in currentRoom.messages"
              :key="msg.id"
          >
            <img class="avatar" :src="msg.avatar" alt="아바타" />
            <div class="message-info">
              <div class="message-top">
                <span class="nickname">{{ msg.nickname }}</span>
                <span class="time">{{ msg.time }}</span>
              </div>
              <p class="message-text">{{ msg.text }}</p>
            </div>
          </div>
        </div>
        <!-- 채팅 입력창 -->
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
    </div>
  </section>
</template>

<script setup>
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import Avatar from '@/assets/img/0.png'
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 더미 채팅방 데이터 예시
const chatRooms = ref([
  {
    id: 1,
    avatar: Avatar,
    nickname: '고라니',
    time: '방금',
    preview: '기말고사 망했는데 어떡하죠',
    unread: 9,
    messages: [
      { id: 1, avatar: Avatar, nickname: '고라니', time: '오전 9:53', text: 'ㄷㄷㄷㄷㄷㄷㄷ' },
      // ... 추가 메시지
    ]
  },
  {
    id: 2,
    avatar: Avatar,
    nickname: 'ddd',
    time: '오전 9:00',
    preview: '오늘 점심 뭐먹지',
    unread: 0,
    messages: [
      { id: 1, avatar: Avatar, nickname: 'ddd', time: '오전 8:15', text: 'ㅋㅋㅋㅋ' }
    ]
  }
  // ...추가 채팅방
])
const activeRoomId = ref(chatRooms.value[0].id)

const input = ref('')
const menuOpen = ref(false)
const menuContainer = ref(null)
const menuDropdown = ref(null)

const currentRoom = computed(() =>
    chatRooms.value.find(room => room.id === activeRoomId.value) || chatRooms.value[0]
)

// 프론트 테스트용
function sendMessage() {
  if (input.value.trim() !== '') {
    currentRoom.value.messages.push({
      id: Date.now(),
      avatar: Avatar,
      nickname: currentRoom.value.nickname,
      time: new Date().toLocaleTimeString(),
      text: input.value
    })
    input.value = ''
  }
}

// 외부 클릭 감지 함수 (모달창 닫는용입니다)
function handleClickOutside(event) {
  if (menuOpen.value && menuContainer.value && !menuContainer.value.contains(event.target)) {
    menuOpen.value = false
  }
}

// ESC 키 감지 함수
function handleEscapeKey(event) {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false
  }
}

function selectRoom(id) {
  activeRoomId.value = id
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function openInvite() {
  menuOpen.value = false
  // 초대 모달 오픈 등
}

function leaveRoom() {
  menuOpen.value = false
  // 채팅방 나가기 등
}


// 컴포넌트 마운트시 이벤트 리스너 등록
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

// 컴포넌트 언마운트시 이벤트 리스너 제거 (메모리 누수 방지)
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style lang="scss">
// 메인 채팅방 컴포넌트 스타일
// src > assets > scss > style.scss 임포트 필수
@import "@/assets/scss/style.scss";

.chat-room {
  .chat-room-inner {
    display: flex;
    gap: 9px; // 좌측 사이드바와 우측 메인 사이의 간격

    .chat-main {
      width: 794px;
      height: 778px;
      border: 1px solid $dim-gray;
      border-radius: 15px 15px 0px 0px;
      background: $white;
      display: flex;
      flex-direction: column;
      position: relative;

      // 상단 헤더
      .chat-header {
        height: 72px;
        padding: 16px;
        border-bottom: 1px solid $dim-gray;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

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
            line-height: 1.25;
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
              font-weight: 500;
              font-size: 12px;
              line-height: 1.25;
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

      // 채팅 메시지 영역
      .chat-content {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 25px; // 메시지 간격

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
                line-height: 1.25;
                color: $dark-black;
              }

              .time {
                font-family: $primary-kr;
                font-weight: 350;
                font-size: 12px;
                line-height: 1.2;
                color: $silver-black;
              }
            }

            .message-text {
              font-family: $primary-kr;
              font-weight: 400;
              font-size: 14px;
              line-height: 1.2;
              color: $dark-black;
              margin: 0;
              word-wrap: break-word;
            }
          }
        }
      }

      // 채팅 입력창
      .chat-input-wrap {
        height: 60px;
        border-top: 1px solid $dim-gray;
        background-color: $light-gray;
        display: flex;
        align-items: center;
        position: relative;

        .chat-input {
          flex: 1;
          height: 100%;
          border: none;
          background: transparent;
          padding: 20px;
          font-family: $primary-kr;
          font-weight: 350;
          font-size: 14px;
          line-height: 1.2;
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
    }
  }
}
</style>