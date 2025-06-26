<template>
  <div class="admin-main-content">
    <!-- 대시보드 뷰 -->
    <AdminDashboard 
      v-if="activeMenu === 'dashboard'"
      :dashboard-data="dashboardData"
      @refresh="handleRefresh"
    />
    
    <!-- 회원관리 뷰 -->
    <AdminUsers 
      v-else-if="activeMenu === 'users'"
      :users-data="usersData"
      @refresh="handleRefresh"
    />
    
    <!-- 게시판관리 뷰 -->
    <AdminPosts 
      v-else-if="activeMenu === 'posts'"
      :posts-data="postsData"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminUsers from './AdminUsers.vue'
import AdminPosts from './AdminPosts.vue'

// ===== Props =====
defineProps({
  activeMenu: {
    type: String,
    required: true
  },
  dashboardData: {
    type: Object,
    default: () => ({})
  },
  usersData: {
    type: Array,
    default: () => []
  },
  postsData: {
    type: Array,
    default: () => []
  }
})

// ===== Emits =====
const emit = defineEmits(['refresh'])

// ===== 이벤트 핸들러 =====
function handleRefresh() {
  emit('refresh')
}
</script>

<style lang="scss" scoped>
.admin-main-content {
  width: 794px;
  height: 778px;
}
</style>
