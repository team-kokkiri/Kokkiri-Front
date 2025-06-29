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
import { ref, watch, defineProps,defineExpose } from 'vue'
import CodeEditorHeader from '@/components/main/CodeEditorHeader.vue'
import CodeInput from '@/components/main/CodeInput.vue'
import ResultHeader from '@/components/main/ResultHeader.vue'
import ExecutionResult from '@/components/main/ExecutionResult.vue'

const props = defineProps({
  problemId: {
    type: Number,
    default: null
  }
})

// emit은 사용하지 않으므로 제거

const sourceCode = ref(`import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next();
        System.out.println(a);
    }
}`)

const selectedLanguage = ref('JAVA')
const executionResult = ref(null)

// Watch for changes in problemId to reset the editor
watch(() => props.problemId, () => {
  executionResult.value = null
})

// Expose methods for parent component
defineExpose({
  getCode: () => sourceCode.value,
  getLanguage: () => selectedLanguage.value,
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
