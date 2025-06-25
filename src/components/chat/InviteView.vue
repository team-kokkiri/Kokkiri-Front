<template>
  <div class="invite-view">
    <div class="invite-header">
      <div class="header-left">
        <span class="invite-title">초대하기</span>
      </div>
      <button class="btn-back" @click="goBack">
        <i class="bi bi-arrow-left"></i>
      </button>
    </div>

    <div class="invite-content-area">
      <div class="invite-list">
        <div
            class="invite-user-item"
            v-for="user in userListToDisplay"
            :key="user.id"
        >
          <img class="avatar" :src="user.avatar || 'https://placehold.co/50x50/cccccc/000000?text=👤'" :alt="user.nickname" />
          <div class="user-info">
            <span class="nickname">{{ user.nickname }}</span>
            <span class="email">{{ user.email }}</span>
          </div>
          <button
              class="btn-invite"
              @click="handleInvite(user)"
              :disabled="isUserInvited(user.id) || isLoading"
          >
            {{ isUserInvited(user.id) ? '초대됨' : '초대' }}
          </button>
        </div>
        <p v-if="isLoading" class="no-results">
            검색 중...
        </p>
        <p v-else-if="userListToDisplay.length === 0 && localSearchQuery" class="no-results">
            검색 결과가 없습니다.
        </p>
        <p v-else-if="userListToDisplay.length === 0 && !localSearchQuery" class="no-results">
            초대할 수 있는 사용자가 없습니다.
        </p>
      </div>
    </div>

    <div v-if="message" :class="['invite-message', messageType]">
        {{ message }}
    </div>

    <div class="invite-search">
      <input
          type="text"
          class="invite-input"
          placeholder="초대할 사람을 닉네임, 이메일로 검색하세요"
          v-model="localSearchQuery"
          @keyup.enter="executeSearch"
      />
      <i class="bi bi-search search-icon" @click="executeSearch"></i>
    </div>

    <div v-if="isModalVisible" class="modal-overlay" @click.self="cancelInvite">
      <div class="modal-content">
        <p class="modal-text">
          <strong>{{ selectedUserForInvite?.nickname }}</strong>님을 초대하시겠습니까?
        </p>
        <div class="modal-actions">
          <button class="btn-modal btn-cancel" @click="cancelInvite" :disabled="isLoading">
            아니오
          </button>
          <button class="btn-modal btn-confirm" @click="confirmInvite" :disabled="isLoading">
            {{ isLoading ? '초대 중...' : '네' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref, watch, onMounted } from 'vue';
import axios from 'axios';


// Props
const props = defineProps({
  roomId: { type: [String, Number], required: true },
  users: { type: Array, required: true, default: () => [] },
  invitedUserIds: { type: Array, required: true, default: () => [] },
  searchQuery: { type: String, default: '' }
});

// Emits
const emit = defineEmits(['back', 'invite', 'search']);

// 로컬 상태
const localSearchQuery = ref(props.searchQuery);
const isLoading = ref(false);
const message = ref('');
const messageType = ref('');
const locallyInvitedUserIds = ref([]);
const isModalVisible = ref(false);
const selectedUserForInvite = ref(null);
const accessToken = ref(null);

const searchResults = ref([]);

// API 기본 URL 설정 (환경 변수 또는 직접 지정)
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090';


// invitedUserIds prop이 변경될 때 locallyInvitedUserIds 업데이트
watch(() => props.invitedUserIds, (newVal) => {
  locallyInvitedUserIds.value = [...newVal];
}, { immediate: true });

// 화면에 표시될 사용자 목록을 결정하는 computed 속성
const userListToDisplay = computed(() => {
  if (localSearchQuery.value.trim()) {
    return searchResults.value;
  }
  return props.users;
});


// 사용자 초대 상태 확인
function isUserInvited(userId) {
  return props.invitedUserIds.includes(userId) || locallyInvitedUserIds.value.includes(userId);
}

// 메시지 표시 함수
function showMessage(msg, type = 'success', duration = 3000) {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
    messageType.value = '';
  }, duration);
}

// 뒤로가기
function goBack() {
  emit('back');
}

// --- 검색 실행 함수 ---
async function executeSearch() {
  const keyword = localSearchQuery.value.trim();
  emit('search', keyword);

  // 검색어가 없으면 검색 결과를 초기화하고, 화면도 초기 목록으로 되돌림
  if (!keyword) {
    searchResults.value = [];
    return;
  }

  isLoading.value = true;
  searchResults.value = [];

  try {
    // API 명세: GET /api/members/search?keyword=...&size=10
    const response = await axios.get(`${API_BASE_URL}/api/members/search`, {
      params: {
        keyword: keyword,
        size: 10, // API 명세에 따라 size 파라미터 추가
        // lastId: // 필요 시 무한 스크롤을 위해 마지막 항목의 ID를 전달
      },
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    });
    searchResults.value = response.data;

  } catch (error) {
    console.error('멤버 검색 API 호출 오류:', error);
    const errorMessage = error.response?.data?.message || '검색 중 오류가 발생했습니다.';
    showMessage(errorMessage, 'error');
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 초대 버튼 클릭 시 모달 열기
function handleInvite(user) {
  if (isUserInvited(user.id)) return;
  selectedUserForInvite.value = user;
  isModalVisible.value = true;
}

// 모달 닫기
function cancelInvite() {
  if (isLoading.value) return;
  isModalVisible.value = false;
  selectedUserForInvite.value = null;
}

// --- 초대 확정 함수 ---
async function confirmInvite() {
  const user = selectedUserForInvite.value;
  if (!user || user.memberId === undefined) {
    console.error("초대할 사용자가 선택되지 않았거나, 사용자 ID가 없습니다.");
    showMessage("사용자 정보가 올바르지 않습니다.", "error");
    return;
  }

    // ✨ 디버깅을 위한 로그 추가
  // API를 호출하기 바로 전에, 우리가 보내려는 데이터가 무엇인지 확인합니다.
  console.log("--- 초대 정보 디버깅 ---");
  console.log("초대할 사용자 객체 (user):", user);
  console.log("전달될 memberId:", user?.memberId);
  console.log("전달될 roomId:", props.roomId);
  console.log("----------------------");

  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    // API 명세: POST /room/group/{roomId}/invite?memberId=...
    await axios.post(
      `${API_BASE_URL}/api/chat/room/group/${props.roomId}/invite`,
      null,
      {
        params: {
          memberId: user.memberId // @RequestParam에 대응
        },
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      }
    );

    // 성공 로직
    locallyInvitedUserIds.value.push(user.memberId);
    showMessage(`${user.nickname}님을 성공적으로 초대했습니다.`, 'success');
    emit('invite', user.memberId);

  } catch (error) {
    console.error('초대 API 호출 중 오류 발생:', error);
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || '초대에 실패했습니다.';
    
    if (errorMessage.includes("이미 참여중인 사용자입니다.") || errorMessage.includes("이미 초대장을 보낸 유저입니다.")) {
        const specificMessage = errorMessage.includes("참여중")
          ? `${user.nickname}님은 이미 채팅방에 참여 중입니다.`
          : `${user.nickname}님에게 이미 초대장을 보냈습니다.`;
        showMessage(specificMessage, 'error');
        if (!locallyInvitedUserIds.value.includes(user.id)) {
          locallyInvitedUserIds.value.push(user.id);
        }
      } else {
        showMessage(errorMessage, 'error');
      }
  } finally {
    isLoading.value = false;
    isModalVisible.value = false;
    selectedUserForInvite.value = null;
  }
}

onMounted(() => {
  accessToken.value = localStorage.getItem('accessToken');
  if (!accessToken.value) {
    console.error("로그인 정보가 없습니다.");
    // 필요 시 로그인 페이지로 리디렉션
  }
});
</script>

<style lang="scss" scoped>
/* 스타일은 이전과 동일하게 유지됩니다. */
.search-icon {
  cursor: pointer;
}
/* ... (이하 모든 스타일 동일) ... */
$dim-gray: #ccc;
$white: #fff;
$black: #000;
$dark-black: #333;
$main-color: #4CAF50;
$silver-black: #888;
$light-gray: #f0f0f0;
$danger-color: #f44336;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');

$primary-kr: 'Inter', sans-serif;
$secondary-kr: 'Noto Sans KR', sans-serif;

.invite-view {
  width: 794px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0px 0px;
  background: $white;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: $primary-kr;
}

.invite-header {
  height: 72px;
  padding: 16px;
  border-bottom: 1px solid $dim-gray;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  
  .header-left {
    flex: 1;
    text-align: center;
    .invite-title {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.25;
      color: $dark-black;
    }
  }

  .btn-back {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 26px;
    height: 26px;
    background: none;
    border: none;
    cursor: pointer;

    .bi {
      font-size: 18px;
      color: $black;
    }

    &:hover {
      background-color: rgba($black, 0.05);
      border-radius: 4px;
    }
  }
}

.invite-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .invite-list {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .no-results {
        text-align: center;
        color: $silver-black;
        margin-top: 20px;
    }

    .invite-user-item {
      display: flex;
      align-items: center;
      gap: 30px;
      width: 100%;
      min-height: 50px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .user-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        overflow: hidden;

        .nickname, .email {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nickname {
          font-family: $secondary-kr;
          font-weight: 500;
          font-size: 18px;
          color: $dark-black;
        }

        .email {
          font-family: $primary-kr;
          font-weight: 400;
          font-size: 14px;
          color: $dark-black;
        }
      }

      .btn-invite {
        width: 65px;
        height: 36px;
        background-color: $main-color;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        font-family: $primary-kr;
        font-weight: 700;
        font-size: 16px;
        color: $white;
        flex-shrink: 0;
        transition: background-color 0.2s ease;

        &:hover:not(:disabled) {
          background-color: darken($main-color, 10%);
        }

        &:disabled {
          background-color: $silver-black;
          cursor: not-allowed;
        }
      }
    }
    
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: $light-gray; }
    &::-webkit-scrollbar-thumb {
      background: $silver-black;
      border-radius: 3px;
      &:hover { background: darken($silver-black, 20%); }
    }
  }
}

.invite-message {
    position: absolute;
    top: 72px;
    left: 0;
    width: 100%;
    padding: 10px 20px;
    text-align: center;
    font-family: $primary-kr;
    font-size: 14px;
    font-weight: 500;
    color: $white;
    z-index: 10;
    
    &.success { background-color: $main-color; }
    &.error { background-color: $danger-color; }
}

.invite-search {
  height: 60px;
  border-top: 1px solid $dim-gray;
  background-color: $light-gray;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 20px;
  flex-shrink: 0;

  .invite-input {
    flex: 1;
    height: 100%;
    border: none;
    background: transparent;
    font-family: $primary-kr;
    font-weight: 500;
    font-size: 14px;
    color: $dark-black;
    outline: none;

    &::placeholder { color: $silver-black; }
  }
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: $white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;
  font-family: $secondary-kr;

  .modal-text {
    font-size: 18px;
    color: $dark-black;
    margin-bottom: 25px;

    strong {
      font-weight: 700;
      color: $main-color;
    }
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 15px;

    .btn-modal {
      width: 100px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid $dim-gray;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &.btn-cancel {
        background-color: $white;
        color: $dark-black;

        &:hover:not(:disabled) {
          background-color: $light-gray;
        }
      }

      &.btn-confirm {
        background-color: $main-color;
        color: $white;
        border-color: $main-color;

        &:hover:not(:disabled) {
          background-color: darken($main-color, 10%);
        }
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: wait;
      }
    }
  }
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
</style>