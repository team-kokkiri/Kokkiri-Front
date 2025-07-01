<template>
  <div class="page-container">
    <section class="admin-page">
      <div class="admin-page-inner">
        <!-- 왼쪽 사이드바 - 네비게이션 -->
        <AdminSidebar
            :active-menu="activeMenu"
            @select-menu="handleMenuSelect"
        />

        <!-- 오른쪽 메인 컨텐츠 영역 -->
        <AdminMainContent
            :active-menu="activeMenu"
            :dashboard-data="dashboardData"
            :users-data="usersData"
            :is-loading="isLoading"
            @refresh="handleRefresh"
            @user-updated="handleUserUpdated"
        />
      </div>
    </section>

    <!-- 전역 로딩 표시 -->
    <div v-if="isGlobalLoading" class="global-loading">
      <div class="loading-content">
        <i class="bi bi-arrow-clockwise spin"></i>
        <p>데이터를 불러오는 중...</p>
      </div>
    </div>

    <!-- 에러 메시지 표시 -->
    <div v-if="errorMessage" class="error-message">
      <div class="error-content">
        <i class="bi bi-exclamation-triangle"></i>
        <p>{{ errorMessage }}</p>
        <button @click="clearError" class="close-error">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminMainContent from '@/components/admin/AdminMainContent.vue'
import axios from 'axios'

// ===== 상태 관리 (SRP: 각 상태는 단일 책임) =====
const activeMenu = ref('dashboard')
const isLoading = ref(false)
const isGlobalLoading = ref(false)
const errorMessage = ref('')

// ===== 인증 및 API 설정 (SSOT) =====
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'

// ===== 데이터 상태 (SSOT) =====
const dashboardData = ref({
  newUsers: 0,
  totalUsers: 0,
  todayPosts: 0,
  totalFiles: 0
})

const usersData = ref([])

// ===== 에러 핸들링 =====
function handleError(error, context = '') {
  console.error(`${context} 오류:`, error)

  if (error.response?.status === 401) {
    errorMessage.value = '인증이 만료되었습니다. 다시 로그인해주세요.'
    // 토큰 제거 및 로그인 페이지로 리다이렉트
    localStorage.removeItem('accessToken')
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  } else if (error.response?.status === 403) {
    errorMessage.value = '관리자 권한이 필요합니다.'
  } else if (error.response?.status >= 500) {
    errorMessage.value = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  } else {
    errorMessage.value = error.message || '알 수 없는 오류가 발생했습니다.'
  }
}

function clearError() {
  errorMessage.value = ''
}

// ===== API 호출 함수들 (SRP) =====
// 구현 완료 - 대시보드
async function loadDashboardData() {
  try {
    isLoading.value = true
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }

    const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, config)

    if (response.data && response.data.result) {
      const result = response.data.result
      dashboardData.value = {
        newUsers: result.todayNewMemberCount || 0,
        totalUsers: result.totalMemberCount || 0,
        todayPosts: result.todayBoardCount || 0,
        totalFiles: result.todayReportCount || 0
      }
    }
  } catch (error) {
    handleError(error, '대시보드 데이터 로딩')
  } finally {
    isLoading.value = false
  }
}

// 구현 완료 - 유저 목록 리스트
async function loadUsersData() {
  try {
    isLoading.value = true
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }

    const response = await axios.get(`${API_BASE_URL}/api/admin/members?page=0&size=10`, config)

    if (response.data && Array.isArray(response.data.result?.content)) {
      usersData.value = response.data.result.content.map(user => ({
        id: user.id,
        name: user.nickname || user.name || '이름 없음',
        email: user.email || '',
        role: user.role || 'USER',
        isRestricted: user.isActive === 'N' || user.isRestricted === 'Y', // API에서 오는 값에 따라 조정
        isActive: user.isActive === 'Y', // 'Y'일 때만 true
        joinDate: user.createdTime,
        teamName: user.teamName,
        profileImage: user.avatar
      }))
    } else {
      usersData.value = []
    }
  } catch (error) {
    handleError(error, '회원 데이터 로딩')
    // 에러 시 빈 배열로 설정
    usersData.value = []
  } finally {
    isLoading.value = false
  }
}

// 메뉴 클릭 시 로드
async function loadMenuData(menuName) {
  if (!token) {
    errorMessage.value = '인증 토큰이 없습니다. 다시 로그인해주세요.'
    return
  }

  try {
    clearError()

    switch (menuName) {
      case 'dashboard':
        await loadDashboardData()
        break
      case 'users':
        await loadUsersData()
        break
      case 'reports':
        // 신고 관리는 컴포넌트 내부에서 로드
        break
      default:
        console.warn(`알 수 없는 메뉴: ${menuName}`)
    }
  } catch (error) {
    handleError(error, '메뉴 데이터 로딩')
  }
}

// ===== 이벤트 핸들러 (SRP) =====
async function handleMenuSelect(menuName) {
  if (isLoading.value) return

  activeMenu.value = menuName
  await loadMenuData(menuName)
}

async function handleRefresh() {
  if (isLoading.value) return
  await loadMenuData(activeMenu.value)
}

async function handleUserUpdated(updateData) {
  try {
    isLoading.value = true

    // API 호출로 사용자 정보 업데이트
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    let endpoint
    if (updateData.type === 'permission') {
      // 권한 변경: PUT /api/admin/members/{id}/role?role=ADMIN
      const role = updateData.data.role === 'admin' ? 'ADMIN' : 'USER'
      endpoint = `${API_BASE_URL}/api/admin/members/${updateData.userId}/role?role=${role}`
    } else {
      // 계정 상태 변경: PUT /api/admin/members/{id}/status?isActive=Y
      const isActive = updateData.data.isRestricted ? 'N' : 'Y'
      endpoint = `${API_BASE_URL}/api/admin/members/${updateData.userId}/status?isActive=${isActive}`
    }

    await axios.put(endpoint, {}, config) // 빈 객체로 body 전송

    // 로컬 상태 업데이트 (SSOT 유지)
    const userIndex = usersData.value.findIndex(user => user.id === updateData.userId)
    if (userIndex !== -1) {
      Object.assign(usersData.value[userIndex], updateData.data)
    }

    // 성공 메시지 (선택사항)
    console.log('사용자 정보가 성공적으로 업데이트되었습니다.')

  } catch (error) {
    handleError(error, '사용자 정보 업데이트')
    // 실패 시 데이터 새로고침
    await loadUsersData()
  } finally {
    isLoading.value = false
  }
}

// ===== 라이프사이클 =====
onMounted(async () => {
  if (!token) {
    errorMessage.value = '로그인이 필요합니다.'
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
    return
  }

  isGlobalLoading.value = true
  try {
    await loadMenuData('dashboard')
  } finally {
    isGlobalLoading.value = false
  }
})

onBeforeUnmount(() => {
  // 컴포넌트 정리
  clearError()
  isLoading.value = false
  isGlobalLoading.value = false
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.page-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  position: relative;
  min-height: 100vh;
}

.admin-page-inner {
  display: flex;
  gap: 9px;
  position: relative;
}

.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($white, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .loading-content {
    text-align: center;
    color: $main-color;

    i {
      font-size: 48px;
      margin-bottom: 20px;
    }

    p {
      margin: 0;
      font-family: $primary-kr;
      font-size: 18px;
      color: $dark-black;
    }
  }
}

.error-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: $white;
  border: 2px solid $orangered;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;

  .error-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    i:first-child {
      font-size: 20px;
      color: $orangered;
      flex-shrink: 0;
      margin-top: 2px;
    }

    p {
      margin: 0;
      font-family: $primary-kr;
      font-size: 14px;
      line-height: 1.4;
      color: $dark-black;
      flex: 1;
    }

    .close-error {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      margin-left: 8px;
      color: $silver-black;
      font-size: 16px;
      transition: color 0.2s ease;

      &:hover {
        color: $orangered;
      }
    }
  }
}

.spin {
  animation: spin 1s linear infinite;
}

</style>