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
          <!-- 안전한 렌더링을 위한 조건부 렌더링 -->
          <template v-if="safeFilteredUsers.length > 0">
            <UserListItem
                v-for="user in safeFilteredUsers"
                :key="`user-${user.id || user.email}`"
                :user="user"
                @manage="handleUserManage"
            />
          </template>

          <!-- 데이터가 없을 때 -->
          <div v-else class="no-data">
            <p>{{ isLoading ? '로딩 중...' : '표시할 회원이 없습니다.' }}</p>
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
        v-if="showDetailView && selectedUser"
        :selected-user="selectedUser"
        @back="handleBackToList"
        @user-updated="handleUserUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch, onBeforeUnmount } from 'vue'
import UserListItem from '@/components/admin/UserListItem.vue'
import UserManagementDetail from '@/components/admin/UserManagementDetail.vue'

// ===== Props =====
const props = defineProps({
  usersData: {
    type: Array,
    default: () => [],
    validator: (value) => Array.isArray(value)
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// ===== Emits =====
const emit = defineEmits(['refresh', 'user-updated'])

// ===== 상태 관리 (SRP: 각 상태는 단일 책임) =====
const searchQuery = ref('')
const showDetailView = ref(false)
const selectedUser = ref(null)

// ===== Computed (SSOT: 단일 진실 공급원) =====
const safeUsersData = computed(() => {
  return Array.isArray(props.usersData) ? props.usersData : []
})

const safeFilteredUsers = computed(() => {
  const users = safeUsersData.value

  if (!searchQuery.value.trim()) {
    return users
  }

  const query = searchQuery.value.toLowerCase().trim()
  return users.filter(user => {
    if (!user) return false

    const name = (user.name || '').toLowerCase()
    const email = (user.email || '').toLowerCase()

    return name.includes(query) || email.includes(query)
  })
})

// ===== Watchers =====
watch(() => props.usersData, (newData) => {
  // 데이터가 변경되면 상세 뷰를 숨김 (안전성 확보)
  if (!Array.isArray(newData) || newData.length === 0) {
    showDetailView.value = false
    selectedUser.value = null
  }
}, { immediate: true })

// ===== 이벤트 핸들러 (SRP: 각 핸들러는 단일 책임) =====
function handleSearch() {
  // 검색 로직은 computed에서 자동 처리됨
  // 추가 로직이 필요한 경우 여기서 구현
}

function handleUserManage(user) {
  console.log('사용자 관리 버튼 클릭:', user)
  
  if (!user || !user.id) {
    console.warn('유효하지 않은 사용자 데이터입니다.', user)
    return
  }

  selectedUser.value = { ...user } // 깊은 복사로 안전성 확보
  showDetailView.value = true
  
  console.log('showDetailView 설정:', showDetailView.value)
  console.log('selectedUser 설정:', selectedUser.value)
}

function handleBackToList() {
  showDetailView.value = false
  selectedUser.value = null
}

function handleUserUpdated(updateData) {
  emit('user-updated', updateData)

  // 로컬 상태도 업데이트 (SSOT 유지)
  if (selectedUser.value && updateData.userId === selectedUser.value.id) {
    Object.assign(selectedUser.value, updateData.data)
  }
}

// ===== 컴포넌트 정리 =====
onBeforeUnmount(() => {
  // 컴포넌트 언마운트 시 상태 정리
  showDetailView.value = false
  selectedUser.value = null
  searchQuery.value = ''
})
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

      &:focus {
        outline: none;
        border-color: $main-color;
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

    p {
      margin: 0;
      font-family: $primary-kr;
      font-size: 16px;
    }
  }
}
</style>