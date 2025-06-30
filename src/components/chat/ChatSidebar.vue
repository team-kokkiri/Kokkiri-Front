<template>
  <aside class="chat-sidebar">
    <div class="chat-sidebar-header">
      <h2 class="chat-title">채팅목록</h2>
    </div>

    <!-- 채팅방 만들기 버튼 (모달 열기) -->
    <div class="create-chat-wrapper">
      <div class="create-chat-button" @click="openCreateRoomModal">
        <i class="bi bi-plus-lg"></i>
        <span>채팅방 만들기</span>
      </div>
    </div>

    <!-- 채팅방 목록 -->
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
          <span class="nickname">{{ room.roomName }}</span>
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
    <!-- 채팅방이 없을 때 메시지 -->
    <div v-else-if="!isLoading" class="empty-chat-message">
      <p>대화중인 채팅방이 없습니다.</p>
      <p>상단의 버튼을 눌러 새 채팅을 시작하세요.</p>
    </div>
  </aside>

  <!-- 채팅방 생성 모달 -->
  <div v-if="isModalOpen" class="modal-overlay" @click.self="closeCreateRoomModal">
    <div class="modal-content">
      <h3 class="modal-title">새 채팅방 만들기</h3>
      <p class="modal-description">채팅방의 이름을 입력해주세요.</p>
      <div class="modal-body">
        <input
          type="text"
          v-model="newRoomName"
          class="modal-input"
          placeholder="예: 프로젝트 회의"
          @keyup.enter="handleCreateRoom"
        />
      </div>
      <div class="modal-footer">
        <button class="modal-btn cancel" @click="closeCreateRoomModal">취소</button>
        <button class="modal-btn confirm" @click="handleCreateRoom">만들기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import axios from '../../utils/axios'

const isModalOpen = ref(false)
const newRoomName = ref('')

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

// 'add-and-select-room' 이벤트를 새로 정의합니다.
const emit = defineEmits(['select', 'load-more', 'room-created', 'add-and-select-room'])

function openCreateRoomModal() {
  newRoomName.value = '';
  isModalOpen.value = true;
}

function closeCreateRoomModal() {
  isModalOpen.value = false;
}

// 이벤트 처리 방식을 단일 이벤트로 개선합니다.
async function handleCreateRoom() {
  const roomName = newRoomName.value.trim();
  if (!roomName) {
    alert('채팅방 이름을 입력해주세요.');
    return;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다. 다시 로그인해주세요.');
    closeCreateRoomModal();
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('roomName', roomName);

    const response = await axios.post('/api/chat/room/group/create', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      }
    });

    const newRoom = response.data;

    if (newRoom && newRoom.roomId && newRoom.roomName) {
      alert(`'${newRoom.roomName}' 채팅방이 성공적으로 개설되었습니다.`);
      
      // 새 방의 정보 전체를 담아 하나의 이벤트를 발생시킵니다.
      emit('add-and-select-room', newRoom);

    } else {
      console.error("서버로부터 받은 데이터 형식이 올바르지 않습니다:", response.data);
      alert("채팅방이 개설되었으나, 응답 데이터에 문제가 있습니다. 목록을 새로고침합니다.");
      
      // 기존 방식(fallback): 목록 갱신만 시도합니다.
      emit('room-created'); 
    }

  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      alert(`채팅방 개설에 실패했습니다. 서버 오류: ${error.response.status}`);
    } else if (error.request) {
      console.error('Network Error:', error.request);
      alert('서버로부터 응답이 없습니다. 네트워크나 서버 상태를 확인해주세요.');
    } else {
      console.error('Axios Error:', error.message);
      alert('요청 중 오류가 발생했습니다.');
    }
  } finally {
    closeCreateRoomModal();
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
  if (!dateTimeString) return '';
  const now = new Date();
  const messageDate = new Date(dateTimeString);
  if (isNaN(messageDate.getTime())) return '';
  const isToday = now.toDateString() === messageDate.toDateString();
  if (isToday) {
    return messageDate.toLocaleTimeString('ko-KR', {
      hour: 'numeric', minute: 'numeric', hour12: true
    });
  } else {
    return messageDate.toLocaleDateString('ko-KR');
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
    .nickname, .time, .preview { color: $white !important; }
  }
}
.chat-room-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
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
  background: $white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-title {
  font-family: $secondary-kr;
  font-weight: 700;
  font-size: 20px;
  color: $black;
  margin: 0;
}
.modal-description {
  font-family: $primary-kr;
  font-size: 14px;
  color: $silver-black;
  margin: -8px 0 0 0;
}
.modal-body {
  margin: 8px 0;
}
.modal-input {
  width: 100%;
  padding: 12px;
  border: 1px solid $dim-gray;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: $main-color;
    box-shadow: 0 0 0 2px rgba($main-color, 0.2);
  }
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-family: $secondary-kr;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  &.confirm {
    background-color: $main-color;
    color: $white;
    &:hover { opacity: 0.9; }
  }
  &.cancel {
    background-color: $light-gray;
    color: $dark-black;
    &:hover { background-color: $dim-gray; }
  }
}
</style>
