<template>
  <div class="execution-result">
    <div v-if="!result" class="no-result">
      <p>실행 결과가 여기에 표시됩니다.</p>
    </div>
    
    <div v-else class="result-content">
      <div v-if="result.status" class="status-info">
        <span class="status-badge" :class="statusClass">
          {{ getStatusText(result.status) }}
        </span>
        <span v-if="result.executionTime" class="execution-time">
          실행 시간: {{ result.executionTime }}ms
        </span>
        <span v-if="result.memoryUsage" class="memory-usage">
          메모리: {{ formatMemory(result.memoryUsage) }}
        </span>
      </div>
      
      <div v-if="result.judgeResult" class="output-section">
        <h4>출력:</h4>
        <pre class="output-content">{{ result.judgeResult }}</pre>
      </div>
      
      <div v-if="result.errorMessage" class="error-section">
        <h4>오류:</h4>
        <pre class="error-content">{{ result.errorMessage }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    default: null
  }
})

const statusClass = computed(() => {
  if (!props.result?.status) return ''
  
  switch (props.result.status) {
    case 'ACCEPTED':
      return 'status-accepted'
    case 'WRONG_ANSWER':
      return 'status-wrong'
    case 'TIME_LIMIT_EXCEEDED':
      return 'status-tle'
    case 'MEMORY_LIMIT_EXCEEDED':
      return 'status-mle'
    case 'RUNTIME_ERROR':
      return 'status-error'
    case 'COMPILE_ERROR':
      return 'status-compile-error'
    default:
      return 'status-unknown'
  }
})

const getStatusText = (status) => {
  const statusMap = {
    'ACCEPTED': '정답',
    'WRONG_ANSWER': '틀렸습니다',
    'TIME_LIMIT_EXCEEDED': '시간 초과',
    'MEMORY_LIMIT_EXCEEDED': '메모리 초과',
    'RUNTIME_ERROR': '런타임 에러',
    'COMPILE_ERROR': '컴파일 에러'
  }
  return statusMap[status] || status
}

const formatMemory = (bytes) => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  return `${Math.round(bytes / (1024 * 1024))}MB`
}
</script>

<style lang="scss" scoped>
.execution-result {
  height: 220px;
  padding: 15px 20px;
  overflow-y: auto;
  
  .no-result {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    
    p {
      margin: 0;
      font-family: 'Spoqa Han Sans Neo', sans-serif;
      font-size: 14px;
    }
  }
  
  .result-content {
    .status-info {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-bottom: 15px;
      
      .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        
        &.status-accepted {
          background: #d4edda;
          color: #155724;
        }
        
        &.status-wrong {
          background: #f8d7da;
          color: #721c24;
        }
        
        &.status-tle,
        &.status-mle {
          background: #fff3cd;
          color: #856404;
        }
        
        &.status-error,
        &.status-compile-error {
          background: #f8d7da;
          color: #721c24;
        }
        
        &.status-unknown {
          background: #e2e3e5;
          color: #383d41;
        }
      }
      
      .execution-time,
      .memory-usage {
        font-size: 12px;
        color: #666;
      }
    }
    
    .output-section,
    .error-section {
      margin-bottom: 15px;
      
      h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }
      
      .output-content,
      .error-content {
        margin: 0;
        padding: 10px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.4;
        white-space: pre-wrap;
        word-break: break-word;
        max-height: 120px;
        overflow-y: auto;
      }
      
      .error-content {
        background: #fff5f5;
        border-color: #feb2b2;
        color: #c53030;
      }
    }
  }
}
</style>
