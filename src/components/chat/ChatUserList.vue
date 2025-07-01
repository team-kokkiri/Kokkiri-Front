<template>
  <div class="user-list-view">
    <!-- 헤더 -->
    <div class="user-list-header">
      <div class="header-left">
        <span class="user-list-title">유저목록</span>
      </div>
      <button class="btn-back" @click="goBack">
        <i class="bi bi-arrow-left"></i>
      </button>
    </div>

    <!-- 유저 목록 영역 -->
    <div class="user-list-content-area" ref="scrollContainerRef">
      <div class="user-list">
        <div
            class="user-item"
            v-for="user in filteredUsers"
            :key="user.memberId" >
          <img class="avatar" :src="user.avatarUrl || defaultAvatar" :alt="user.nickname" />
          <div class="user-info">
            <span class="nickname">{{ user.nickname }}</span>
            <span class="email">{{ user.email || '이메일 정보 없음' }}</span>
          </div>
          <div class="user-action">
            <span v-if="isCurrentUser(user)" class="me-badge">나</span>
            <button v-else class="btn-chat" @click="openConfirmModal(user)">채팅하기</button>
          </div>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <span>멤버를 불러오는 중...</span>
        </div>
      </div>
    </div>

    <!-- 검색창 -->
    <div class="user-list-search">
      <input
          type="text"
          class="search-input"
          placeholder="찾을 사람을 검색하세요"
          :value="searchQuery"
          @input="handleSearchInput"
      />
      <i class="bi bi-search search-icon"></i>
    </div>
  </div>

  <!-- 채팅 시작 확인 모달 -->
  <div v-if="isConfirmModalOpen" class="modal-overlay" @click.self="closeConfirmModal">
    <div class="modal-content">
      <h3 class="modal-title">1:1 채팅 시작</h3>
      <p class="modal-description" v-if="selectedUserForChat">
        <strong>{{ selectedUserForChat.nickname }}</strong>님과 채팅을 시작하시겠습니까?
      </p>
      <div class="modal-footer">
        <button class="modal-btn cancel" @click="closeConfirmModal">취소</button>
        <button class="modal-btn confirm" @click="handleConfirmStartChat">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
import defaultAvatar from '@/assets/img/0.png';
import { useUserStore } from '@/stores/user'
import axios from '../../utils/axios' // axios 인스턴스 가져오기

const userStore = useUserStore()

// Props
const props = defineProps({
  users: { type: Array, required: true },
  searchQuery: { type: String, default: '' },
  isLoading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: true }
})

// Emits
const emit = defineEmits([
  'back',
  'search',
  'load-more',
  'start-private-chat', // 기존 이벤트는 유지 (필요시 사용)
  'navigate-to-room'    // 새로 추가된 이벤트
]);

// 모달 상태 관리
const scrollContainerRef = ref(null);
const isConfirmModalOpen = ref(false);
const selectedUserForChat = ref(null);

// 본인 여부 확인
const isCurrentUser = (user) => {
  return user && user.email && userStore && userStore.email && user.email.trim() === userStore.email.trim();
}

// 검색 필터링
const filteredUsers = computed(() => {
  if (!props.searchQuery) return props.users;
  const query = props.searchQuery.toLowerCase();
  return props.users.filter(user =>
      user.nickname.toLowerCase().includes(query)
  );
});

function goBack() { emit('back') }
function handleSearchInput(event) { emit('search', event.target.value) }

// 모달 열기/닫기 함수
function openConfirmModal(user) {
  selectedUserForChat.value = user;
  isConfirmModalOpen.value = true;
}

function closeConfirmModal() {
  isConfirmModalOpen.value = false;
  selectedUserForChat.value = null;
}

// "확인" 버튼 클릭 시 1:1 채팅방 생성/조회 API 호출 (디버깅 강화)
async function handleConfirmStartChat() {
  if (!selectedUserForChat.value) return;

  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert("로그인 정보가 필요합니다.");
    closeConfirmModal();
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('otherMemberId', selectedUserForChat.value.memberId);
    
    console.log(`[채팅 시작] API 호출: ${selectedUserForChat.value.nickname} (ID: ${selectedUserForChat.value.memberId})`);
    
    // 백엔드 API 호출
    const response = await axios.post('/api/chat/room/private/create', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
    });

    console.log("[API 응답]", response);
    const roomId = response.data;
    console.log(`[받은 Room ID] 타입: ${typeof roomId}, 값: ${roomId}`);

    // roomId가 유효한지 (숫자 또는 숫자로 변환 가능한 문자열인지) 확인
    if (roomId && !isNaN(parseInt(roomId, 10))) {
      alert(`${selectedUserForChat.value.nickname}님과의 채팅을 시작합니다.`);
      // 부모 컴포넌트에 roomId와 함께 네비게이션 이벤트를 전달
      emit('navigate-to-room', roomId);
    } else {
      console.error("서버로부터 유효한 채팅방 ID를 받지 못했습니다:", roomId);
      alert("채팅방 정보를 받아오지 못했습니다. 서버 응답을 확인해주세요.");
    }
  } catch (error) {
    console.error("1:1 채팅 시작에 실패했습니다:", error);
  } finally {
    closeConfirmModal();
  }
}

// 무한 스크롤
const handleScroll = () => {
  const container = scrollContainerRef.value;
  if (container) {
    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    if (isNearBottom && !props.isLoading && props.hasMore) {
      emit('load-more');
    }
  }
};

onMounted(() => { scrollContainerRef.value?.addEventListener('scroll', handleScroll); });
onUnmounted(() => { scrollContainerRef.value?.removeEventListener('scroll', handleScroll); });
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.user-list-view {
  width: 794px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0 0;
  background: $white;
  display: flex;
  flex-direction: column;
  position: relative;
}
.user-list-header {
  height: 72px; padding: 16px; border-bottom: 1px solid $dim-gray;
  display: flex; justify-content: space-between; align-items: center;

  .header-left .user-list-title {
    font-family: $secondary-kr; font-weight: 500; font-size: 18px; color: $dark-black;
  }
  .btn-back {
    width: 26px; height: 26px; background: none; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    .bi { font-size: 18px; color: $black; }
    &:hover { background-color: rgba($black, 0.05); border-radius: 4px; }
  }
}
.user-list-content-area {
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
  .user-list {
    flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;
    .user-item {
      display: flex; align-items: center; gap: 15px; height: 50px;
      .avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
      .user-info {
        flex-grow: 1; display: flex; flex-direction: column; gap: 4px;
        .nickname { font-family: $secondary-kr; font-weight: 500; font-size: 18px; color: $dark-black; }
        .email { font-family: $primary-kr; font-weight: 400; font-size: 14px; color: $dark-black; }
      }
      .user-action {
        flex-shrink: 0; margin-left: auto; padding-right: 10px;
        .me-badge {
          font-family: $primary-kr; font-size: 14px; color: $main-color; font-weight: 700;
          padding: 6px 12px; border-radius: 6px; background-color: rgba($main-color, 0.1);
        }
        .btn-chat {
          padding: 6px 12px; background-color: $main-color; color: $white;
          border: none; border-radius: 6px; font-family: $secondary-kr; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: background-color 0.2s;
          &:hover { background-color: darken($main-color, 10%); }
        }
      }
    }
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: $light-gray; }
    &::-webkit-scrollbar-thumb { background: $silver-black; border-radius: 3px;
      &:hover { background: darken($silver-black, 20%); }
    }
  }
}
.user-list-search {
  height: 60px; border-top: 1px solid $dim-gray; background-color: $light-gray;
  display: flex; align-items: center; position: relative; padding: 0 20px;
  .search-input {
    flex: 1; height: 100%; border: none; background: transparent;
    font-family: $primary-kr; font-weight: 350; font-size: 14px; color: $dark-black; outline: none;
    &::placeholder { color: #686868; }
  }
  .search-icon {
    width: 24px; height: 24px; color: $silver-black; font-size: 16px; flex-shrink: 0;
  }
}
.loading-indicator {
  display: flex; justify-content: center; align-items: center;
  padding: 20px; font-size: 14px; color: #888;
}

/* 모달 스타일 추가 */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5); display: flex;
  align-items: center; justify-content: center; z-index: 1000;
}
.modal-content {
  background: $white; padding: 24px; border-radius: 12px;
  width: 90%; max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex; flex-direction: column; gap: 16px;
}
.modal-title {
  font-family: $secondary-kr; font-weight: 700; font-size: 20px; color: $black; margin: 0;
}
.modal-description {
  font-family: $primary-kr; font-size: 15px; color: $silver-black; margin: 0;
  strong { color: $main-color; font-weight: 700; }
}
.modal-footer {
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;
}
.modal-btn {
  padding: 10px 20px; border: none; border-radius: 8px;
  font-family: $secondary-kr; font-weight: 700; font-size: 15px;
  cursor: pointer; transition: all 0.2s ease;
  &.confirm {
    background-color: $main-color; color: $white;
    &:hover { opacity: 0.9; }
  }
  &.cancel {
    background-color: $light-gray; color: $dark-black;
    &:hover { background-color: $dim-gray; }
  }
}
</style>
