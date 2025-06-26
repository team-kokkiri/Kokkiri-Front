<template>
  <aside class="chat-sidebar">
    <div class="chat-sidebar-header">
      <h2 class="chat-title">채팅목록</h2>
    </div>
    <div class="chat-room-list" @scroll="handleScroll">
      <div
          v-for="room in chatRooms"
          :key="room.roomId"
          :class="['chat-room-item', { active: room.roomId === activeRoomId }]"
          @click="selectRoom(room.roomId)"
      >
        <div class="chat-room-top">
          <span class="nickname">{{ room.roomName }}</span>
          <span class="time">{{ formatDisplayTime(room.lastMessageTime) }}</span>
        </div>
        <div class="chat-room-bottom">
          <span class="preview">{{ room.lastMessage }}</span>
          <span class="badge-alert" v-if="room.unReadCount > 0"><em>{{ room.unReadCount }}</em></span>
        </div>
      </div>
      <div v-if="isLoading" class="loading-indicator">
        채팅 목록을 불러오는 중...
      </div>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 부모로부터 받을 props를 정의합니다.
const props = defineProps({
  chatRooms: Array,
  activeRoomId: [String, Number],
  isLoading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  }
})

// 부모로 보낼 이벤트를 정의합니다.
const emit = defineEmits(['select', 'load-more'])

// 채팅방 선택 이벤트를 발생시키는 함수
function selectRoom(id) {
  emit('select', id)
}

// 스크롤 위치를 감지하여 추가 데이터 로딩 이벤트를 발생시키는 함수
function handleScroll(event) {
  
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (props.isLoading || !props.hasMore) return
  if (scrollHeight - scrollTop <= clientHeight + 50) {
    emit('load-more')
  }
}

// 날짜/시간 포맷팅 유틸리티 함수
function formatDisplayTime(dateTimeString) {
  if (!dateTimeString) return '';
  const now = new Date();
  const messageDate = new Date(dateTimeString);

  if (isNaN(messageDate.getTime())) return ''; // 유효하지 않은 날짜 처리

  const isToday = now.toDateString() === messageDate.toDateString();
  
  if (isToday) {
    // 오늘 보낸 메시지는 '오후 3:30' 형식으로 표시
    return messageDate.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } else {
    // 어제 또는 그 이전에 보낸 메시지는 '2025. 6. 26.' 형식으로 표시
    return messageDate.toLocaleDateString('ko-KR');
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/style.scss";

.chat-sidebar {
  width: 377px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px;
  background: $white;
  display: flex;
  flex-direction: column;

  .chat-sidebar-header {
    padding: 0 17px;
    height: 72px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $dim-gray;
    flex-shrink: 0;
    .chat-title {
      font-family: $secondary-kr;
      font-weight: 700;
      font-size: 22px;
      line-height: 1.25;
      color: $black;
      margin: 0;
    }
  }

  .chat-room-list {
    flex-grow: 1;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
      border-radius: 6px;
    }

    .chat-room-item {
      width: 100%;
      height: 64px;
      padding: 12px 18px;
      border-bottom: 1px solid $dim-gray;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      box-sizing: border-box;

      &:hover {
        background-color: rgba($main-color, 0.05);
      }

      &.active {
        background-color: $main-color;
        .nickname,
        .time,
        .preview{
          color: $white !important;
        }
      }

      .chat-room-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;

        .nickname {
          font-family: $secondary-kr;
          font-weight: 700;
          font-size: 14px;
          line-height: 1.25;
          color: $dark-black;
        }

        .time {
          font-family: $primary-kr;
          font-weight: 400;
          font-size: 12px;
          line-height: 1.2;
          color: $silver-black;
        }
      }

      .chat-room-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .preview {
          font-family: $primary-kr;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.2;
          color: $silver-black;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 10px;
        }

        .badge-alert {
          min-width: 18px;
          height: 18px;
          background-color: $orangered;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;

          em {
            font-family: "Roboto", sans-serif;
            font-weight: 400;
            font-size: 12px;
            color: $white;
            font-style: normal;
            line-height: 1;
          }
        }
      }
    }
  }

  .loading-indicator {
    padding: 20px;
    text-align: center;
    font-size: 14px;
    color: #888;
  }
}
</style>