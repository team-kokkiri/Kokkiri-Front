<template>
  <div class="daily-problem">
    <div class="problem-header">
      <h1 class="problem-title">{{ problemData?.title || '문제 타이틀' }}</h1>
    </div>
    
    <div class="problem-main">
      <div class="left-section">
        <ProblemDescription :problem="problemData" />
      </div>
      
      <div class="right-section">
        <CodeEditor 
          ref="codeEditorRef"
          :problem-id="problemData?.id"
        />
      </div>
    </div>
    
    <div class="problem-footer">
      <div class="action-buttons">
        <ActionButton 
          text="제출하기" 
          @click="handleSubmitCode"
          :loading="isSubmitting"
          primary
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProblemDescription from '@/components/daily-problem/ProblemDescription.vue'
import CodeEditor from '@/components/daily-problem/CodeEditor.vue'
import ActionButton from '@/components/common/ActionButton.vue'
import { useDailyProblem } from '@/composables/useDailyProblem'

// 코드 에디터 컴포넌트 참조
const codeEditorRef = ref(null)

// 일일 문제 컴포저블 사용
const { 
  problemData, 
  fetchTodaysProblem,
  submitCode,
  isSubmitting
} = useDailyProblem()

/**
 * 컴포넌트 마운트 시 오늘의 문제 데이터 로드
 */
onMounted(() => {
  fetchTodaysProblem()
})

/**
 * 코드 제출 버튼 클릭 핸들러
 * 에디터에서 코드를 가져와 제출하고 결과를 표시
 * 정답인 경우 문제 데이터를 새로고침하여 랭킹 업데이트
 */
const handleSubmitCode = async () => {
  if (!codeEditorRef.value || !problemData.value?.id) return
  
  try {
    const sourceCode = codeEditorRef.value.getCode()
    const language = codeEditorRef.value.getLanguage()
    
    const result = await submitCode(sourceCode, language)
    codeEditorRef.value.setResult(result.submission)
    
    // 정답인 경우 문제 데이터 새로고침으로 랭킹 업데이트
    if (result.accepted) {
      await fetchTodaysProblem()
    }
  } catch (error) {
    console.error('Failed to submit code:', error)
  }
}
</script>

<style lang="scss" scoped>
.daily-problem {
  max-width: 1180px;
  width: 1180px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 15px;
  background: white;
  
  .problem-header {
    padding: 25px 20px;
    border-bottom: 1px solid #ddd;
    
    .problem-title {
      font-family: 'Spoqa Han Sans Neo', sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: #333;
      margin: 0;
    }
  }
  
  .problem-main {
    display: flex;
    min-height: 630px;
    
    .left-section {
      width: 402px;
      border-right: 1px solid #ddd;
    }
    
    .right-section {
      flex: 1;
    }
  }
  
  .problem-footer {
    border-top: 1px solid #ddd;
    padding: 19px 20px;
    display: flex;
    justify-content: flex-end;
    
    .action-buttons {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
