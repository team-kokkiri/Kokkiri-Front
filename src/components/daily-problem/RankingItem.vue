<template>
  <div class="ranking-item" :class="{ 'expanded': isExpanded }">
    <!-- 랭킹 정보 표시 -->
    <div class="ranking-info" @click="$emit('toggle-expansion', ranking)">
      <div class="rank-icon">
        <img 
          v-if="ranking.rankPosition <= 3" 
          :src="getRankIcon(ranking.rankPosition)" 
          :alt="`${ranking.rankPosition}등`"
          class="crown-icon"
        />
        <span v-else class="rank-number">{{ ranking.rankPosition }}</span>
      </div>
      
      <div class="member-info">
        <div class="member-name">{{ ranking.memberNickname }}</div>
        <div class="team-badge">{{ ranking.memberTeamName }}</div>
      </div>
      
      <div class="solve-time">{{ formatSolveTime(ranking.solveTime) }}</div>
    </div>
    
    <!-- 코드 드롭다운 -->
    <div v-if="isExpanded" class="code-dropdown">
      <div v-if="isLoadingCode" class="code-loading">
        <p>코드를 불러오는 중...</p>
      </div>
      
      <div v-else-if="submissionCode" class="code-display">
        <div class="code-header">
          <h4>{{ submissionCode.memberNickname }}님의 코드</h4>
          <div class="code-actions">
            <span class="language-badge">{{ submissionCode.language }}</span>
            <button class="close-button" @click.stop="$emit('toggle-expansion', ranking)">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        
        <div class="code-content">
          <pre><code>{{ submissionCode.sourceCode }}</code></pre>
        </div>
        
        <div class="code-stats">
          <span>실행시간: {{ submissionCode.executionTime }}ms</span>
          <span>메모리: {{ formatMemory(submissionCode.memoryUsage) }}</span>
          <span>제출시간: {{ formatSubmissionTime(submissionCode.submissionTime) }}</span>
        </div>
      </div>
      
      <div v-else class="code-error">
        <p>코드를 불러올 수 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useDailyRanking } from '@/composables/useDailyRanking'

// Props 정의
defineProps({
  ranking: {
    type: Object,
    required: true
  },
  isExpanded: {
    type: Boolean,
    default: false
  },
  submissionCode: {
    type: Object,
    default: null
  },
  isLoadingCode: {
    type: Boolean,
    default: false
  }
})

// Emits 정의
defineEmits(['toggle-expansion'])

// 컴포저블에서 유틸리티 함수들 가져오기
const { formatSolveTime } = useDailyRanking()

/**
 * 순위에 따른 왕관 아이콘 이미지 경로 반환
 * @param {number} rank - 순위
 * @returns {string} 이미지 경로
 */
const getRankIcon = (rank) => {
  try {
    return require(`@/assets/img/rank${rank}.png`)
  } catch (error) {
    console.warn(`Rank icon not found for rank ${rank}`)
    return ''
  }
}

/**
 * 메모리 사용량을 포맷팅
 * @param {number} bytes - 바이트 수
 * @returns {string} 포맷팅된 메모리 크기
 */
const formatMemory = (bytes) => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  return `${Math.round(bytes / (1024 * 1024))}MB`
}

/**
 * 제출 시간을 포맷팅
 * @param {string} dateTimeString - ISO 날짜 문자열
 * @returns {string} 포맷팅된 시간
 */
const formatSubmissionTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return date.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.ranking-item {
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  
  &:first-child {
    border-top: 1px solid #ddd;
  }
  
  &:hover {
    background: #f8f9fa;
  }
  
  .ranking-info {
    display: flex;
    align-items: center;
    padding: 20px 15px;
    cursor: pointer;
    height: 75px;
    box-sizing: border-box;
    
    .rank-icon {
      width: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      
      .crown-icon {
        width: 31px;
        height: 21px;
        object-fit: contain;
      }
      
      .rank-number {
        font-family: 'Noto Sans KR', sans-serif;
        font-weight: 700;
        font-size: 18px;
        color: #333;
      }
    }
    
    .member-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .member-name {
        font-family: 'Noto Sans KR', sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #333;
      }
      
      .team-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #2196f3;
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-family: 'Noto Sans KR', sans-serif;
        font-weight: 350;
        font-size: 10px;
        width: fit-content;
      }
    }
    
    .solve-time {
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 350;
      font-size: 12px;
      color: #000;
      white-space: nowrap;
    }
  }
  
  .code-dropdown {
    border-top: 1px solid #ddd;
    
    .code-loading,
    .code-error {
      padding: 30px;
      text-align: center;
      color: #666;
    }
    
    .code-display {
      .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #ddd;
        background: white;
        
        h4 {
          margin: 0;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #333;
        }
        
        .code-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          
          .language-badge {
            background: #e3f2fd;
            color: #1976d2;
            padding: 5px 10px;
            border-radius: 10px;
            font-family: 'Noto Sans KR', sans-serif;
            font-weight: 500;
            font-size: 10px;
          }
          
          .close-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            color: #333;
            font-size: 16px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;

          }
        }
      }
      
      .code-content {
        padding: 15px;
        background: #f8f8f8;
        
        pre {
          margin: 0;
          overflow-x: auto;
          
          code {
            font-family: 'Noto Sans KR', sans-serif;
            font-weight: 500;
            font-size: 10px;
            line-height: 1.2;
            color: #000;
          }
        }
      }
      
      .code-stats {
        display: flex;
        gap: 20px;
        padding: 9px 14px;
        background: white;
        font-family: 'Noto Sans KR', sans-serif;
        font-weight: 500;
        font-size: 10px;
        color: #333;
        border-top: 1px solid #ddd;
      }
    }
  }
}
</style>
