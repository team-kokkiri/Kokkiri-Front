<template>
  <div class="execution-result">
    <div v-if="!result" class="no-result">
      <p>실행 결과가 여기에 표시됩니다.</p>
    </div>
    
    <div v-else class="result-content">
      <!-- 테스트케이스 결과 표시 -->
      <div v-if="result.totalTestCases > 0" class="test-cases-summary">
        <h4>테스트 결과: {{ result.passedTestCases }} / {{ result.totalTestCases }} 통과</h4>
        <div class="test-case-list">
          <div v-for="testCase in result.testCaseResults" :key="testCase.testCaseNum" 
               class="test-case-item" :class="{ 'passed': testCase.passed, 'failed': !testCase.passed }">
            <div class="test-case-header">
              <span class="test-case-number">테스트 {{ testCase.testCaseNum }}</span>
              <span class="test-case-status" :class="testCase.passed ? 'passed' : 'failed'">
                {{ testCase.passed ? '통과' : '실패' }}
              </span>
            </div>
            <div v-if="!testCase.passed && testCase.errorMessage" class="test-case-error">
              {{ testCase.errorMessage }}
            </div>
            <div v-if="testCase.expectedOutput !== 'Hidden'" class="test-case-details">
              <div class="expected-output">
                <strong>예상 출력:</strong>
                <pre>{{ testCase.expectedOutput }}</pre>
              </div>
              <div v-if="testCase.actualOutput" class="actual-output">
                <strong>실제 출력:</strong>
                <pre>{{ testCase.actualOutput }}</pre>
              </div>
            </div>
            <div v-else class="hidden-test-case">
              히든 테스트케이스
            </div>
          </div>
        </div>
      </div>
      
      <!-- 기존 상태 정보 -->
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
      
      <div v-if="result.judgeResult && !result.testCaseResults" class="output-section">
        <h4>출력:</h4>
        <pre class="output-content">{{ result.judgeResult }}</pre>
      </div>
      
      <div v-if="result.errorMessage && !result.testCaseResults" class="error-section">
        <h4>오류:</h4>
        <pre class="error-content">{{ result.errorMessage }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

// Props 정의
const props = defineProps({
  result: {
    type: Object,
    default: null
  }
})

/**
 * 실행 상태에 따른 CSS 클래스를 결정하는 computed
 * @returns {string} 상태에 맞는 CSS 클래스명
 */
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

/**
 * 영어 상태를 한글로 변환하는 함수
 * @param {string} status - 영어 상태명
 * @returns {string} 한글 상태명
 */
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

/**
 * 바이트 단위를 사람이 읽기 쉬운 단위로 변환하는 함수
 * @param {number} bytes - 바이트 수
 * @returns {string} 포맷팅된 메모리 크기 문자열
 */
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
    .test-cases-summary {
      margin-bottom: 15px;
      
      h4 {
        margin: 0 0 10px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
      
      .test-case-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        
        .test-case-item {
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 10px;
          background: #f9f9f9;
          
          &.passed {
            border-color: #4caf50;
            background: #f1f8f4;
          }
          
          &.failed {
            border-color: #f44336;
            background: #fef1f1;
          }
          
          .test-case-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            
            .test-case-number {
              font-weight: 600;
              font-size: 14px;
            }
            
            .test-case-status {
              font-size: 12px;
              font-weight: 600;
              padding: 2px 8px;
              border-radius: 3px;
              
              &.passed {
                color: #2e7d32;
                background: #c8e6c9;
              }
              
              &.failed {
                color: #c62828;
                background: #ffcdd2;
              }
            }
          }
          
          .test-case-error {
            color: #c62828;
            font-size: 12px;
            margin: 5px 0;
          }
          
          .test-case-details {
            margin-top: 10px;
            font-size: 12px;
            
            .expected-output,
            .actual-output {
              margin: 5px 0;
              
              strong {
                display: block;
                margin-bottom: 3px;
              }
              
              pre {
                margin: 0;
                padding: 5px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
              }
            }
          }
          
          .hidden-test-case {
            font-style: italic;
            color: #666;
            font-size: 12px;
            margin-top: 5px;
          }
        }
      }
    }
    
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
