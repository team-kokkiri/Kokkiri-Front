<template>
  <div class="code-editor">
    <div class="editor-section">
      <CodeEditorHeader />
      <CodeInput 
        v-model:code="sourceCode"
        :language="selectedLanguage"
      />
    </div>
    
    <div class="result-section">
      <ResultHeader />
      <ExecutionResult :result="executionResult" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineExpose } from 'vue'
import CodeEditorHeader from '@/components/daily-problem/CodeEditorHeader.vue'
import CodeInput from '@/components/daily-problem/CodeInput.vue'
import ResultHeader from '@/components/daily-problem/ResultHeader.vue'
import ExecutionResult from '@/components/daily-problem/ExecutionResult.vue'

// Props 정의
const props = defineProps({
  problemId: {
    type: Number,
    default: null
  }
})

// 코드 에디터 상태
const sourceCode = ref(`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`)

const selectedLanguage = ref('JAVA')
const executionResult = ref(null)

/**
 * 문제 ID 변경 시 에디터 상태 초기화
 */
watch(() => props.problemId, () => {
  executionResult.value = null
})

/**
 * 부모 컴포넌트에서 사용할 수 있는 메소드들을 노출
 */
defineExpose({
  /**
   * 현재 작성된 코드를 반환
   * @returns {string} 소스 코드
   */
  getCode: () => sourceCode.value,
  
  /**
   * 현재 선택된 프로그래밍 언어를 반환
   * @returns {string} 프로그래밍 언어
   */
  getLanguage: () => selectedLanguage.value,
  
  /**
   * 실행 결과를 설정
   * @param {Object} result - 실행 결과 객체
   */
  setResult: (result) => {
    executionResult.value = result
  }
})
</script>

<style lang="scss" scoped>
.code-editor {
  display: flex;
  flex-direction: column;
  height: 630px;
  
  .editor-section {
    height: 360px;
    border-bottom: 1px solid #ddd;
  }
  
  .result-section {
    flex: 1;
  }
}
</style>
