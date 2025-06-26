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
      <div class="invite-list" ref="scrollContainer" @scroll="handleScroll">
        <div
            class="invite-user-item"
            v-for="user in userListToDisplay"
            :key="user.memberId" >
          <img class="avatar" :src="user.avatar || 'https://placehold.co/50x50/cccccc/000000?text=👤'" :alt="user.nickname" />
          <div class="user-info">
            <span class="nickname">{{ user.nickname }}</span>
            <span class="email">{{ user.email }}</span>
          </div>

          <button
              class="btn-invite"
              @click="handleInvite(user)"
              :disabled="getUserStatus(user) !== 'invitable' || isLoading"
              :class="{ 'disabled-status': getUserStatus(user) !== 'invitable' }"
          >
            <span v-if="getUserStatus(user) === 'self'">본인</span>
            <span v-else-if="getUserStatus(user) === 'participating'">참여중</span>
            <span v-else-if="getUserStatus(user) === 'invited'">초대됨</span>
            <span v-else>초대</span>
          </button>
        </div>
        
        <p v-if="isLoading" class="loading-indicator">
          불러오는 중...
        </p>
        <p v-if="userListToDisplay.length === 0 && !isLoading && localSearchQuery" class="no-results">
          검색 결과가 없습니다.
        </p>
        <p v-else-if="userListToDisplay.length === 0 && !isLoading && !localSearchQuery" class="no-results">
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
          @keyup.enter="startNewSearch"
      />
      <i class="bi bi-search search-icon" @click="startNewSearch"></i>
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
import { computed, defineProps, defineEmits, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

// Props
const props = defineProps({
  roomId: { type: [String, Number], required: true },
  users: { type: Array, required: true, default: () => [] },
  invitedUserIds: { type: Array, required: true, default: () => [] },
  searchQuery: { type: String, default: '' },
  currentUser: { type: Object, required: true },
  participantIds: { type: Array, required: true, default: () => [] }
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
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090';

// 스크롤 페이징을 위한 상태 변수 추가
const scrollContainer = ref(null); // 스크롤 DOM 엘리먼트
const lastMemberId = ref(null);    // 마지막으로 로드된 멤버의 ID (커서 역할)
const hasMoreMembers = ref(true); // 더 불러올 멤버가 있는지 여부

// invitedUserIds prop이 변경될 때 locallyInvitedUserIds 업데이트
watch(() => props.invitedUserIds, (newVal) => {
  locallyInvitedUserIds.value = [...newVal];
}, { immediate: true });

// 화면에 표시될 사용자 목록 결정
const userListToDisplay = computed(() => {
  return localSearchQuery.value.trim() ? searchResults.value : props.users;
});

// 멤버 데이터 로딩 함수
async function fetchMembers() {
  const keyword = localSearchQuery.value.trim();
  if (!keyword || isLoading.value || !hasMoreMembers.value) {
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/members/search`, {
      params: {
        keyword: keyword,
        size: 10,
        // lastId 파라미터를 API 요청에 추가
        lastId: lastMemberId.value 
      },
      headers: { 'Authorization': `Bearer ${accessToken.value}` }
    });
    
    // API 응답에 hasNext와 같은 필드가 있다고 가정합니다. 없다면, 불러온 데이터 수로 판단합니다.
    const fetchedUsers = response.data.content || response.data; // API 응답 구조에 따라 조정
    const hasNext = response.data.hasNext === undefined ? fetchedUsers.length === 10 : response.data.hasNext;

    // 본인 제외 필터링
    const newUsers = props.currentUser?.memberId
      ? fetchedUsers.filter(user => user.memberId !== props.currentUser.memberId)
      : fetchedUsers;

    searchResults.value.push(...newUsers); // 기존 결과에 추가
    hasMoreMembers.value = hasNext;

    if (newUsers.length > 0) {
      lastMemberId.value = newUsers[newUsers.length - 1].memberId; // 마지막 ID 업데이트
    }
  } catch (error) {
    console.error('멤버 검색 API 호출 오류:', error);
    const errorMessage = error.response?.data?.message || '검색 중 오류가 발생했습니다.';
    showMessage(errorMessage, 'error');
  } finally {
    isLoading.value = false;
  }
}

// 새로운 검색 시작 함수
async function startNewSearch() {
  const keyword = localSearchQuery.value.trim();
  emit('search', keyword);
  
  // 검색어가 없으면, 검색 결과 초기화 후 종료
  if (!keyword) {
    searchResults.value = [];
    lastMemberId.value = null;
    hasMoreMembers.value = true;
    return;
  }

  // 상태 초기화
  searchResults.value = [];
  lastMemberId.value = null;
  hasMoreMembers.value = true;

  // 첫 페이지 로드
  await fetchMembers();
}

// 스크롤 이벤트 핸들러
function handleScroll() {
  const container = scrollContainer.value;
  if (container) {
    // 스크롤이 맨 아래 근처에 도달했는지 확인 (100px 버퍼)
    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    if (isNearBottom && !isLoading.value && hasMoreMembers.value) {
      fetchMembers(); // 추가 데이터 로드
    }
  }
}

// 사용자 상태 판별
function getUserStatus(user) {
  if (!props.currentUser || props.currentUser.memberId === null) return 'invitable';
  if (user.memberId === props.currentUser.memberId) return 'self';
  if (props.participantIds.includes(user.memberId)) return 'participating';
  if (props.invitedUserIds.includes(user.memberId) || locallyInvitedUserIds.value.includes(user.memberId)) return 'invited';
  return 'invitable';
}

// 메시지 표시
function showMessage(msg, type = 'success', duration = 3000) {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => { message.value = ''; messageType.value = ''; }, duration);
}

// 뒤로가기
function goBack() { emit('back'); }

// 초대 모달 열기 
function handleInvite(user) {
  if (getUserStatus(user) !== 'invitable') return;
  selectedUserForInvite.value = user;
  isModalVisible.value = true;
}

// 모달 닫기 
function cancelInvite() {
  if (isLoading.value) return;
  isModalVisible.value = false;
  selectedUserForInvite.value = null;
}

// 초대 확정 
async function confirmInvite() {
  const user = selectedUserForInvite.value;
  if (!user || user.memberId === undefined) {
    showMessage("사용자 정보가 올바르지 않습니다.", "error");
    return;
  }
  if (isLoading.value) return;

  isLoading.value = true;
  message.value = '';
  try {
    await axios.post(`${API_BASE_URL}/api/chat/room/group/${props.roomId}/invite`, null, {
      params: { memberId: user.memberId },
      headers: { 'Authorization': `Bearer ${accessToken.value}` }
    });
    locallyInvitedUserIds.value.push(user.memberId);
    showMessage(`${user.nickname}님을 성공적으로 초대했습니다.`, 'success');
    emit('invite', user.memberId);
  } catch (error) {
    console.error('초대 API 호출 중 오류 발생:', error);
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || '초대에 실패했습니다.';
    if (errorMessage.includes("이미")) {
      showMessage(errorMessage, 'error');
      if (!locallyInvitedUserIds.value.includes(user.memberId)) {
        locallyInvitedUserIds.value.push(user.memberId);
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

// 생명주기 훅
onMounted(() => {
  accessToken.value = localStorage.getItem('accessToken');
  if (!accessToken.value) {
    console.error("로그인 정보가 없습니다.");
  }
  // 스크롤 이벤트 리스너 추가 (template ref가 연결된 후)
  // watchEffect 등을 사용해 scrollContainer.value 가 유효할 때 리스너를 추가할 수도 있습니다.
  // 여기서는 onMounted에서 바로 추가합니다.
  if(scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  // 컴포넌트 파괴 전 이벤트 리스너 제거
  if(scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style lang="scss" scoped>
.loading-indicator {
    text-align: center;
    padding: 10px;
    color: #888;
}
.no-results {
    text-align: center;
    padding: 20px;
    color: #888;
}

.btn-invite.disabled-status {
  background-color: #a0a0a0;
  cursor: default;
}

.search-icon {
  cursor: pointer;
}

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