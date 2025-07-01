<template>
  <section class="admin-reports">
    <header class="section-header">
      <h1 class="section-title">신고관리</h1>
      <button 
        @click="handleRefresh" 
        class="refresh-button"
        :disabled="isLoading"
      >
        새로고침
      </button>
    </header>

    <!-- 탭 메뉴 -->
    <div class="tab-menu">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="['tab-button', { active: activeTab === tab.value }]"
      >
        {{ tab.label }}
        <span class="count-badge" v-if="tab.value === 'PENDING' && tab.count > 0">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 신고 리스트 -->
    <div class="reports-content">
      <div v-if="isLoading" class="loading-state">
        <p>데이터를 불러오는 중...</p>
      </div>

      <div v-else-if="reports.length === 0" class="empty-state">
        <p>{{ activeTab === 'PENDING' ? '처리 대기 중인' : '처리 완료된' }} 신고가 없습니다.</p>
      </div>

      <div v-else class="reports-list">
        <ReportListItem
          v-for="report in reports"
          :key="report.reportId"
          :report="report"
          :is-pending="activeTab === 'PENDING'"
          @process="handleProcessReport"
        />
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="currentPage--"
          :disabled="currentPage === 0"
          class="page-button"
        >
        </button>
        
        <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
        
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages - 1"
          class="page-button"
        >
          >
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, computed, defineProps, defineEmits } from 'vue'
import ReportListItem from './ReportListItem.vue'
import axios from 'axios'

// ===== Props & Emits =====
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

// ===== 상태 관리 =====
const activeTab = ref('PENDING')
const reports = ref([])
const currentPage = ref(0)
const totalPages = ref(0)
const isLoadingLocal = ref(false)
const pendingCount = ref(0)
const processedCount = ref(0)

// ===== API 설정 =====
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'
const token = localStorage.getItem('accessToken')

// ===== 탭 설정 =====
const tabs = computed(() => [
  { value: 'PENDING', label: '처리 대기', count: pendingCount.value },
  { value: 'PROCESSED', label: '처리 완료', count: processedCount.value }
])

// ===== API 호출 함수 =====
async function loadReports(status = 'PENDING', page = 0) {
  try {
    isLoadingLocal.value = true
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/reports?status=${status}&page=${page}&size=20`,
      config
    )

    if (response.data) {
      reports.value = response.data.content || []
      totalPages.value = response.data.totalPages || 0
      
      // 카운트 업데이트
      if (status === 'PENDING') {
        pendingCount.value = response.data.totalElements || 0
      } else {
        processedCount.value = response.data.totalElements || 0
      }
    }
  } catch (error) {
    console.error('신고 목록 로드 실패:', error)
    reports.value = []
  } finally {
    isLoadingLocal.value = false
  }
}

// ===== 신고 처리 함수 =====
async function handleProcessReport(reportId) {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }

    await axios.patch(
      `${API_BASE_URL}/api/reports/${reportId}/status?status=PROCESSED`,
      {},
      config
    )

    // 성공 시 목록 새로고침
    await loadReports(activeTab.value, currentPage.value)
    
    // 대기 중인 신고 수 업데이트
    if (activeTab.value === 'PENDING') {
      pendingCount.value = Math.max(0, pendingCount.value - 1)
    }
  } catch (error) {
    console.error('신고 처리 실패:', error)
    alert('신고 처리에 실패했습니다.')
  }
}

// ===== 이벤트 핸들러 =====
function handleRefresh() {
  loadReports(activeTab.value, currentPage.value)
  emit('refresh')
}

// ===== 탭 변경 감지 =====
watch(activeTab, (newTab) => {
  currentPage.value = 0
  loadReports(newTab, 0)
})

// ===== 페이지 변경 감지 =====
watch(currentPage, (newPage) => {
  loadReports(activeTab.value, newPage)
})

// ===== 라이프사이클 =====
onMounted(async () => {
  // 처리 대기 건수 조회
  await loadReports('PENDING', 0)
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.admin-reports {
  width: 794px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px;
  background: $white;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .section-header {
    padding: 0 17px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $dim-gray;
    flex-shrink: 0;

    .section-title {
      font-family: $secondary-kr;
      font-weight: 700;
      font-size: 22px;
      line-height: 1.25;
      color: $black;
      margin: 0;
    }

    .refresh-button {
      padding: 8px 16px;
      border: 1px solid $dim-gray;
      border-radius: 8px;
      background: $white;
      font-family: $primary-kr;
      font-size: 14px;
      color: $dark-black;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: $light-gray;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .tab-menu {
    display: flex;
    border-bottom: 1px solid $dim-gray;

    .tab-button {
      flex: 1;
      height: 48px;
      border: none;
      background: none;
      font-family: $primary-kr;
      font-size: 16px;
      color: $silver-black;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &.active {
        color: $main-color;
        font-weight: 600;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: $main-color;
        }
      }

      .count-badge {
        padding: 2px 8px;
        background: $orangered;
        color: $white;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        min-width: 24px;
        text-align: center;
      }
    }
  }

  .reports-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .loading-state,
    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: $silver-black;

      p {
        font-family: $primary-kr;
        font-size: 16px;
        margin: 0;
      }
    }

    .reports-list {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 16px;
      border-top: 1px solid $dim-gray;

      .page-button {
        width: 32px;
        height: 32px;
        border: 1px solid $dim-gray;
        border-radius: 4px;
        background: $white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: $light-gray;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .page-info {
        font-family: $primary-kr;
        font-size: 14px;
        color: $dark-black;
      }
    }
  }
}
</style>
