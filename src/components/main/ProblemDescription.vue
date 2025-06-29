<template>
  <div class="problem-description">
    <ProblemSection 
      title="문제 설명"
      :content="problem?.description"
    />
    
    <ProblemSection 
      title="제한 사항"
      :content="constraintsText"
    />
    
    <ProblemSection 
      title="입출력 예"
      :content="exampleText"
    />
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import ProblemSection from '@/components/main/ProblemSection.vue'

const props = defineProps({
  problem: {
    type: Object,
    default: null
  }
})

const constraintsText = computed(() => {
  if (!props.problem) return ''
  
  const timeLimit = props.problem.timeLimit || 1000
  const memoryLimit = props.problem.memoryLimit || 128
  
  return `시간 제한: ${timeLimit}ms\n메모리 제한: ${memoryLimit}MB${props.problem.inputDescription ? '\n\n' + props.problem.inputDescription : ''}`
})

const exampleText = computed(() => {
  if (!props.problem) return ''
  
  let text = ''
  if (props.problem.sampleInput !== null && props.problem.sampleInput !== undefined) {
    text += `입력 #1\n${props.problem.sampleInput || '(입력 없음)'}\n`
  }
  if (props.problem.sampleOutput !== null && props.problem.sampleOutput !== undefined) {
    text += `출력 #1\n${props.problem.sampleOutput}`
  }
  
  return text
})
</script>

<style lang="scss" scoped>
.problem-description {
  padding: 0;
}
</style>
