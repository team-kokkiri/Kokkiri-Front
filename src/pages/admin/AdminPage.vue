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
          :posts-data="postsData"
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

// ===== 상태 관리 =====
const activeMenu = ref('dashboard') // 'dashboard', 'users', 'posts'

// 대시보드 데이터
const dashboardData = ref({
  newUsers: 12,
  totalUsers: 125,
  todayPosts: 85,
  totalFiles: 32
})

// 회원 관리 데이터
const usersData = ref([
  // TODO: API 연동 후 실제 데이터로 교체
])

// 게시판 관리 데이터
const postsData = ref([
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
    case 'posts':
      await loadPostsData()
      break
  }
}

async function loadDashboardData() {
  // TODO: 대시보드 통계 데이터 API 호출
  console.log('Loading dashboard data...')
}

async function loadUsersData() {
  // TODO: 회원 목록 API 호출
  console.log('Loading users data...')
}

async function loadPostsData() {
  // TODO: 게시글 목록 API 호출
  console.log('Loading posts data...')
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
