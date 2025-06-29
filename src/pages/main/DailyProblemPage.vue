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
          text="코드 실행" 
          @click="handleRunCode"
          :loading="isRunning"
        />
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
import ProblemDescription from '@/components/main/ProblemDescription.vue'
import CodeEditor from '@/components/main/CodeEditor.vue'
import ActionButton from '@/components/common/ActionButton.vue'
import { useDailyProblem } from '@/composables/useDailyProblem'

const codeEditorRef = ref(null)

const { 
  problemData, 
  fetchTodaysProblem,
  runCode,
  submitCode,
  isRunning,
  isSubmitting
} = useDailyProblem()

onMounted(() => {
  fetchTodaysProblem()
})

const handleRunCode = async () => {
  if (!codeEditorRef.value || !problemData.value?.id) return
  
  try {
    const sourceCode = codeEditorRef.value.getCode()
    const language = codeEditorRef.value.getLanguage()
    
    const result = await runCode(sourceCode, language)
    codeEditorRef.value.setResult(result)
  } catch (error) {
    console.error('Failed to run code:', error)
  }
}

const handleSubmitCode = async () => {
  if (!codeEditorRef.value || !problemData.value?.id) return
  
  try {
    const sourceCode = codeEditorRef.value.getCode()
    const language = codeEditorRef.value.getLanguage()
    
    const result = await submitCode(sourceCode, language)
    codeEditorRef.value.setResult(result.submission)
    
    // Refresh problem data to update rankings
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
