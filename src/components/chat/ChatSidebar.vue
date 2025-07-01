<template>
  <aside class="chat-sidebar">
    <div class="chat-sidebar-header">
      <h2 class="chat-title">채팅목록</h2>
    </div>

    <div class="create-chat-wrapper">
      <div class="create-chat-button" @click="openCreateRoomModal">
        <i class="bi bi-plus-lg"></i>
        <span>채팅방 만들기</span>
      </div>
    </div>

    <div
      class="chat-room-list"
      v-if="chatRooms && chatRooms.length > 0"
      @scroll="handleScroll"
    >
      <div
        v-for="room in chatRooms"
        :key="room.roomId"
        :class="['chat-room-item', { active: room.roomId === activeRoomId }]"
        @click="selectRoom(room.roomId)"
      >
        <div class="chat-room-top">
          <div class="title-wrapper">
            <span class="nickname">{{ room.roomName }}</span>
            <span v-if="room.isGroupChat === 'Y' && room.userCount > 0" class="user-count">
              {{ room.userCount }}
            </span>
          </div>
          <span class="time">{{ formatDisplayTime(room.lastMessageTime) }}</span>
        </div>
        <div class="chat-room-bottom">
          <span class="preview">{{ room.lastMessage }}</span>
          <span class="badge-alert" v-if="room.unReadCount > 0">
            <em>{{ room.unReadCount }}</em>
          </span>
        </div>
      </div>
      <div v-if="isLoading" class="loading-indicator">
        채팅 목록을 불러오는 중...
      </div>
    </div>
    <div v-else-if="!isLoading" class="empty-chat-message">
      <p>대화중인 채팅방이 없습니다.</p>
      <p>상단의 버튼을 눌러 새 채팅을 시작하세요.</p>
    </div>
  </aside>

  <!-- 채팅방 생성 모달 -->
  <CreateRoomModal
    :visible="isModalOpen"
    @close="closeCreateRoomModal"
    @success="handleRoomCreated"
  />
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import CreateRoomModal from '@/components/common/CreateRoomModal.vue'

const isModalOpen = ref(false)

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

const emit = defineEmits(['select', 'load-more', 'room-created', 'add-and-select-room'])

function openCreateRoomModal() {
  isModalOpen.value = true
}

function closeCreateRoomModal() {
  isModalOpen.value = false
}

function handleRoomCreated(newRoom) {
  if (newRoom && newRoom.roomId && newRoom.roomName) {
    emit('add-and-select-room', newRoom)
  } else {
    emit('room-created')
  }
}

function selectRoom(id) {
  emit('select', id)
}

function handleScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (props.isLoading || !props.hasMore) return
  if (scrollHeight - scrollTop <= clientHeight + 50) {
    emit('load-more')
  }
}

function formatDisplayTime(dateTimeString) {
  if (!dateTimeString) return ''
  const now = new Date()
  const messageDate = new Date(dateTimeString)
  if (isNaN(messageDate.getTime())) return ''
  const isToday = now.toDateString() === messageDate.toDateString()
  if (isToday) {
    return messageDate.toLocaleTimeString('ko-KR', {
      hour: 'numeric', minute: 'numeric', hour12: true
    })
  } else {
    return messageDate.toLocaleDateString('ko-KR')
  }
}
</script>

<style lang="scss">
$dim-gray: #e0e0e0;
$white: #ffffff;
$black: #000000;
$main-color: #5a7dff;
$secondary-kr: "Spoqa Han Sans Neo", sans-serif;
$primary-kr: "Pretendard", sans-serif;
$dark-black: #333333;
$silver-black: #666666;
$orangered: #ff4500;
$light-gray: #f0f0f0;

.chat-sidebar {
  width: 377px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px;
  background: $white;
  display: flex;
  flex-direction: column;
}
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
.create-chat-wrapper {
  padding: 15px 17px;
  border-bottom: 1px solid $dim-gray;
  flex-shrink: 0;
}
.create-chat-button {
  width: 100%;
  height: 50px;
  border: 1px dashed $main-color;
  border-radius: 10px;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: $main-color;
  &:hover { background-color: rgba($main-color, 0.05); border-style: solid; }
  &:active { transform: translateY(1px); }
  i { font-size: 20px; margin-right: 8px; }
  span { font-family: $secondary-kr; font-weight: 700; font-size: 15px; }
}
.chat-room-list {
  flex-grow: 1;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 6px; }
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
  &:hover { background-color: rgba($main-color, 0.05); }
  &.active {
    background-color: $main-color;
    .nickname, .time, .preview, .user-count { color: $white !important; }
  }
}
.chat-room-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  
  .title-wrapper {
    display: flex;
    align-items: baseline; // 닉네임과 숫자 baseline 정렬
    gap: 6px;
    overflow: hidden; // 긴 닉네임이 레이아웃을 깨지 않도록
  }
  
  .nickname {
    font-family: $secondary-kr;
    font-weight: 700;
    font-size: 14px;
    line-height: 1.25;
    color: $dark-black;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-count {
    font-family: $primary-kr;
    font-size: 13px;
    font-weight: 500;
    color: $silver-black;
    flex-shrink: 0; // 숫자가 줄어들지 않도록
  }

  .time {
    font-family: $primary-kr;
    font-weight: 400;
    font-size: 12px;
    line-height: 1.2;
    color: $silver-black;
    flex-shrink: 0; // 시간이 줄어들지 않도록
  }
}
.chat-room-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
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
.loading-indicator {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: #888;
}
.empty-chat-message {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: $silver-black;
  padding: 20px;
  p { margin: 5px 0; font-family: $primary-kr; font-size: 14px; line-height: 1.5; }
}
</style>
