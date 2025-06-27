<template>
  <div class="admin-users">
    <!-- 회원 목록 화면 -->
    <div v-if="!showDetailView" class="users-list-view">
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

    <!-- 회원 관리 상세 화면 -->
    <UserManagementDetail
      v-if="showDetailView"
      :selected-user="selectedUser"
      @back="handleBackToList"
      @user-updated="handleUserUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import UserListItem from './UserListItem.vue'
import UserManagementDetail from './UserManagementDetail.vue'

// ===== Props =====
const props = defineProps({
  usersData: {
    type: Array,
    default: () => []
  }
})

// ===== Emits =====
const emit = defineEmits(['refresh'])

// ===== 상태 관리 =====
const searchQuery = ref('')
const showDetailView = ref(false)
const selectedUser = ref(null)

// Mock 데이터 (API 연동 전 테스트용)
const mockUsers = [
  { id: 1, name: '고라니', email: 'sp2877@naver.com', avatar: '', role: 'normal', isRestricted: false },
  { id: 2, name: '사용자1', email: 'user1@example.com', avatar: '', role: 'admin', isRestricted: false },
  { id: 3, name: '사용자2', email: 'user2@example.com', avatar: '', role: 'normal', isRestricted: true },
  { id: 4, name: '사용자3', email: 'user3@example.com', avatar: '', role: 'normal', isRestricted: false },
  { id: 5, name: '사용자4', email: 'user4@example.com', avatar: '', role: 'normal', isRestricted: false },
  { id: 6, name: '사용자5', email: 'user5@example.com', avatar: '', role: 'admin', isRestricted: false },
  { id: 7, name: '사용자6', email: 'user6@example.com', avatar: '', role: 'normal', isRestricted: false },
  { id: 8, name: '사용자7', email: 'user7@example.com', avatar: '', role: 'normal', isRestricted: true },
  { id: 9, name: '사용자8', email: 'user8@example.com', avatar: '', role: 'normal', isRestricted: false },
  { id: 10, name: '사용자9', email: 'user9@example.com', avatar: '', role: 'normal', isRestricted: false }
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
  selectedUser.value = user
  showDetailView.value = true
}

function handleBackToList() {
  showDetailView.value = false
  selectedUser.value = null
}

function handleUserUpdated(updateData) {
  // 사용자 정보 업데이트 처리
  console.log('User updated:', updateData)
  
  // 실제 구현에서는 API 호출로 서버에 변경사항 전송
  // 현재는 로컬 mock 데이터 업데이트
  const userIndex = mockUsers.findIndex(u => u.id === updateData.userId)
  if (userIndex !== -1) {
    if (updateData.type === 'permission') {
      mockUsers[userIndex].role = updateData.data.role
    } else if (updateData.type === 'restriction') {
      mockUsers[userIndex].isRestricted = updateData.data.isRestricted
    }
    // selectedUser도 업데이트
    selectedUser.value = { ...mockUsers[userIndex] }
  }
  
  // 부모 컴포넌트에 변경사항 알림
  emit('refresh')
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.admin-users {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.users-list-view {
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
