<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <!-- 통계 카드들 -->
      <div class="stats-grid">
        <div 
          v-for="stat in statsCards" 
          :key="stat.id"
          class="stat-card"
        >
          <div class="stat-icon">
            <i :class="stat.iconClass"></i>
          </div>
          <div class="stat-info">
            <h3 class="stat-title">{{ stat.title }}</h3>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

// ===== Props =====
const props = defineProps({
  dashboardData: {
    type: Object,
    required: true
  }
})

// ===== Computed =====
const statsCards = computed(() => [
  {
    id: 'new-users',
    title: '신규 가입자 수',
    value: `${props.dashboardData.newUsers || 0}명`,
    iconClass: 'bi bi-person-fill-add'
  },
  {
    id: 'total-users', 
    title: '전체 가입자 수',
    value: `${props.dashboardData.totalUsers || 0}명`,
    iconClass: 'bi bi-people-fill'
  },
  {
    id: 'today-posts',
    title: '오늘 작성된 게시글',
    value: `${props.dashboardData.todayPosts || 0}건`,
    iconClass: 'bi bi-clipboard-data-fill'
  },
  {
    id: 'total-files',
    title: '공유 자료 수',
    value: `${props.dashboardData.totalFiles || 0}개`,
    iconClass: 'bi bi-file-earmark-arrow-down-fill'
  }
])
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.admin-dashboard {
  width: 100%;
  height: 100%;
  border: 1px solid $dim-gray;
  border-radius: 15px;
  background: $white;
  box-sizing: border-box;
}

.dashboard-container {
  width: 100%;
  height: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  height: 100%;
}

.stat-card {
  border: 1px solid $dim-gray;
  border-radius: 15px;
  background: $white;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;

  .stat-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba($main-color, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    position: relative;

    i {
      font-size: 60px;
      color: $main-color;
    }
  }

  .stat-info {
    .stat-title {
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 20px;
      line-height: 1.252;
      color: $black;
      margin: 0 0 20px 0;
    }

    .stat-value {
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 60px;
      line-height: 1.252;
      color: $black;
      margin: 0;
    }
  }
}
</style>
