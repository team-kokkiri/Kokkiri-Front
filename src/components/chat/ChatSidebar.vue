<template>
  <aside class="chat-sidebar">
    <div class="chat-sidebar-header">
      <h2 class="chat-title">채팅목록</h2>
    </div>

    <!-- 채팅방 목록이 있을 때 -->
    <div v-if="chatRooms && chatRooms.length > 0" class="chat-room-list">
      <div
          v-for="room in chatRooms"
          :key="room.id"
          :class="['chat-room-item', { active: room.id === activeRoomId }]"
          @click="selectRoom(room.id)"
      >
        <div class="chat-room-top">
          <span class="nickname">{{ room.nickname }}</span>
          <span class="time">{{ room.time }}</span>
        </div>
        <div class="chat-room-bottom">
          <span class="preview">{{ room.preview }}</span>
          <span class="badge-alert" v-if="room.unread > 0"><em>{{ room.unread }}</em></span>
        </div>
      </div>
    </div>

    <!-- 채팅방 목록이 없을 때 생성 버튼 -->
    <div v-else class="empty-chat-section">
      <div class="create-chat-button" @click="$emit('create')">
        <i class="bi bi-plus-lg"></i>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  chatRooms: Array,
  activeRoomId: [String, Number]
})

const emit = defineEmits(['select', 'create'])

function selectRoom(id) {
  emit('select', id)
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

  .chat-sidebar-header {
    padding: 0 17px 0 17px;
    height: 72px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $dim-gray;
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
    .chat-room-item {
      width: 100%;
      height: 64px;
      padding: 12px 18px;
      border-bottom: 1px solid $dim-gray;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;

      &:hover {
        background-color: rgba($main-color, 0.05);
      }

      &.active {
        background-color: $main-color;
        color: $white;
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
            margin-top: 0;
            margin-bottom: 2px;
            margin-left: 1px;
          }
        }
      }
    }
  }

  // 채팅방이 없을 때 생성 버튼 영역
  .empty-chat-section {
    padding: 25px 17px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .create-chat-button {
      width: 343px;
      height: 78px;
      border: 1px solid $main-color;
      border-radius: 15px;
      background: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba($main-color, 0.05);
      }

      &:active {
        transform: translateY(2px);
      }

      i {
        font-size: 30px;
        color: $main-color;
      }
    }
  }
}
</style>