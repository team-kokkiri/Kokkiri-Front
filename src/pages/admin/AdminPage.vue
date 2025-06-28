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
          @refresh="handleRefresh"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminMainContent from '@/components/admin/AdminMainContent.vue'
import axios from 'axios'

// ===== 상태 관리 =====
const activeMenu = ref('dashboard') // 'dashboard', 'users', 'posts'
const token = localStorage.getItem('accessToken');
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// 대시보드 데이터
const dashboardData = ref({
  newUsers: 0,
  totalUsers: 0,
  todayPosts: 0,
  totalFiles: 0
})

// 회원 관리 데이터
const usersData = ref([
  // TODO: API 연동 후 실제 데이터로 교체
])

// ===== 이벤트 핸들러 =====
function handleMenuSelect(menuName) {
  activeMenu.value = menuName
  // TODO: 메뉴 변경 시 필요한 데이터 로딩
  loadMenuData(menuName)
}

function handleRefresh() {
  // TODO: 현재 활성 메뉴의 데이터를 새로고침
  loadMenuData(activeMenu.value)
}

async function loadMenuData(menuName) {
  // TODO: API 호출로 메뉴별 데이터 로딩
  switch (menuName) {
    case 'dashboard':
      await loadDashboardData()
      break
    case 'users':
      await loadUsersData()
      break
  }
}

async function loadDashboardData() {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard`,
      config
    )
    console.log('대시보드 API 응답:', res.data)
    // 결과 매핑

    const result = res.data.result
    dashboardData.value = {
      newUsers: result.todayNewMemberCount,
      totalUsers: result.totalMemberCount,
      todayPosts: result.todayBoardCount,
      totalFiles: result.todayReportCount
    }
    console.log('대시보드 데이터:', dashboardData.value)
  } catch (err) {
    console.error('대시보드 데이터 불러오기 실패:', err)
  }
}

async function loadUsersData() {
  // TODO: 회원 목록 API 호출
  console.log('Loading users data...')
}

// ===== 라이프사이클 =====
onMounted(() => {
  loadMenuData('dashboard')
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.page-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.admin-page-inner {
  display: flex;
  gap: 9px;
}
</style>
