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
      :is-loading="isLoading"
      @refresh="handleRefresh"
      @user-updated="handleUserUpdated"
    />
    
    <!-- 신고관리 뷰 -->
    <AdminReports
      v-else-if="activeMenu === 'reports'"
      :is-loading="isLoading"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminUsers from './AdminUsers.vue'
import AdminReports from './AdminReports.vue'

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
  isLoading: {
    type: Boolean,
    default: false
  }
})

// ===== Emits =====
const emit = defineEmits(['refresh', 'user-updated'])

// ===== 이벤트 핸들러 =====
function handleRefresh() {
  emit('refresh')
}

function handleUserUpdated(updateData) {
  emit('user-updated', updateData)
}
</script>

<style lang="scss" scoped>
.admin-main-content {
  width: 794px;
  height: 778px;
}
</style>
