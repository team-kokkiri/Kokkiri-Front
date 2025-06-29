<template>
  <div class="daily-ranking">
    <div class="ranking-header">
      <div class="header-container">
        <h1 class="ranking-title">일일 랭킹</h1>
        <button
            class="refresh-button"
            @click="refreshRankings"
            :disabled="isLoading"
        >
          <span :class="{ 'spinning': isLoading }"><i class="bi bi-arrow-clockwise"></i></span>
        </button>
      </div>
    </div>
    
    <div class="ranking-content">
      <!-- 로딩 상태 -->
      <div v-if="isLoading && rankings.length === 0" class="loading-state">
        <p>랭킹을 불러오는 중...</p>
      </div>
      
      <!-- 에러 상태 -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="refreshRankings" class="retry-button">다시 시도</button>
      </div>
      
      <!-- 랭킹 목록 -->
      <div v-else-if="rankings.length > 0" class="ranking-list">
        <RankingItem
          v-for="ranking in rankings"
          :key="ranking.id"
          :ranking="ranking"
          :is-expanded="expandedRankingId === ranking.id"
          :submission-code="expandedRankingId === ranking.id ? submissionCode : null"
          :is-loading-code="isLoadingCode"
          @toggle-expansion="handleToggleExpansion"
        />
      </div>
      
      <!-- 빈 상태 -->
      <div v-else class="empty-state">
        <p>아직 아무도 문제를 풀지 않았습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import RankingItem from '@/components/daily-problem/RankingItem.vue'
import { useDailyRanking } from '@/composables/useDailyRanking'

// 랭킹 컴포저블 사용
const {
  rankings,
  isLoading,
  error,
  expandedRankingId,
  submissionCode,
  isLoadingCode,
  fetchTodayRankings,
  toggleRankingExpansion
} = useDailyRanking()

/**
 * 컴포넌트 마운트 시 랭킹 데이터 로드
 */
onMounted(() => {
  fetchTodayRankings()
})

/**
 * 랭킹 새로고침
 */
const refreshRankings = () => {
  fetchTodayRankings()
}

/**
 * 랭킹 아이템 확장/축소 토글 핸들러
 * @param {Object} ranking - 랭킹 객체
 */
const handleToggleExpansion = (ranking) => {
  toggleRankingExpansion(ranking.id, ranking.submissionId)
}
</script>

<style lang="scss" scoped>
.daily-ranking {
  max-width: 832px;
  width: 832px;
  margin: 0 auto;
  
  .ranking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    
    .header-container {
      border: 1px solid #ddd;
      padding: 17px 15px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      
      .ranking-title {
        font-family: 'Noto Sans KR', sans-serif;
        font-weight: 500;
        font-size: 22px;
        color: #333;
        margin: 0;
      }
    }
    
    .refresh-button {
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-left: 10px;
      white-space: nowrap;
      background: white;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      .spinning {
        animation: spin 1s linear infinite;
      }
      .bi {
        font-size: 18px;
      }
    }
  }
  
  .ranking-content {
    .loading-state,
    .error-state,
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
      
      p {
        font-size: 18px;
        margin: 0 0 20px 0;
      }
      
      .retry-button {
        padding: 10px 20px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        
        &:hover {
          background: #d32f2f;
        }
      }
    }
    
    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
