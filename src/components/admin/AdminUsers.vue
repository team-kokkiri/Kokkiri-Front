<template>
  <div class="admin-users">
    <!-- 헤더 -->
    <div class="users-header">
      <div class="header-title">
        <span>회원관리</span>
      </div>
    </div>

    <!-- 회원 목록 -->
    <div class="users-list">
      <div class="users-container">
        <UserListItem
          v-for="user in filteredUsers"
          :key="user.id"
          :user="user"
          @manage="handleUserManage"
        />
        
        <!-- 데이터가 없을 때 -->
        <div v-if="filteredUsers.length === 0" class="no-data">
          <p>표시할 회원이 없습니다.</p>
        </div>
      </div>
    </div>

    <!-- 검색창 -->
    <div class="search-section">
      <div class="search-box">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="검색하려는 이름을 입력하세요"
            class="search-input"
            @input="handleSearch"
        />
        <div class="search-icon">
          <i class="bi bi-search"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import UserListItem from './UserListItem.vue'

// ===== Props =====
const props = defineProps({
  usersData: {
    type: Array,
    default: () => []
  }
})

// ===== Emits =====
defineEmits(['refresh'])

// ===== 상태 관리 =====
const searchQuery = ref('')

// Mock 데이터 (API 연동 전 테스트용)
const mockUsers = [
  { id: 1, name: '고라니', email: 'sp2877@naver.com', avatar: '' },
  { id: 2, name: '사용자1', email: 'user1@example.com', avatar: '' },
  { id: 3, name: '사용자2', email: 'user2@example.com', avatar: '' },
  { id: 4, name: '사용자3', email: 'user3@example.com', avatar: '' },
  { id: 5, name: '사용자4', email: 'user4@example.com', avatar: '' },
  { id: 6, name: '사용자5', email: 'user5@example.com', avatar: '' },
  { id: 7, name: '사용자6', email: 'user6@example.com', avatar: '' },
  { id: 8, name: '사용자7', email: 'user7@example.com', avatar: '' },
  { id: 9, name: '사용자8', email: 'user8@example.com', avatar: '' },
  { id: 10, name: '사용자9', email: 'user9@example.com', avatar: '' }
]

// ===== Computed =====
const filteredUsers = computed(() => {
  // props.usersData가 비어있으면 mock 데이터 사용
  const users = props.usersData.length > 0 ? props.usersData : mockUsers
  
  if (!searchQuery.value) {
    return users
  }
  
  return users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// ===== 이벤트 핸들러 =====
function handleSearch() {
  // 검색 로직은 computed에서 자동 처리됨
  // 필요한 경우 여기서 API 호출 등 추가 로직 구현
}

function handleUserManage(user) {
  // TODO: 회원 관리 액션 구현 (수정, 삭제, 권한 변경 등)
  console.log('User manage:', user)
  
  // 예시: 관리 모달 열기, 상태 변경 등
  // 현재는 콘솔 로그만 출력
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.admin-users {
  width: 100%;
  height: 100%;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0 0;
  background: $white;
  display: flex;
  flex-direction: column;
}

.users-header {
  border-bottom: 1px solid $dim-gray;
  flex-shrink: 0;

  .header-title {
    padding-left: 15px;
    height: 72px;
    padding-top: 28px;
    span {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
    }
  }

  .header-line {
    width: 100%;
    height: 1px;
    background: $dim-gray;
    margin-top: 8px;
  }
}

.search-section {
  border-bottom: 1px solid $dim-gray;
  flex-shrink: 0;

  .search-box {
    position: relative;
    width: 100%;
    height: 60px;

    .search-input {
      width: 100%;
      height: 100%;
      border: 1px solid $dim-gray;
      border-bottom: none;
      background: $light-gray;
      padding: 0 50px 0 20px;
      box-sizing: border-box;
      font-family: $primary-kr;
      font-weight: 350;
      font-size: 14px;
      line-height: 1.2;
      color: $dark-black;

      &::placeholder {
        color: $silver-black;
      }
    }

    .search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 18px;
        color: $silver-black;
      }
    }
  }
}

.users-list {
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 6px;
  }
  
  .users-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .no-data {
    text-align: center;
    padding: 40px 20px;
    color: $silver-black;
  }
}
</style>
