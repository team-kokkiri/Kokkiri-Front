<template>
  <div class="code-input">
    <textarea
      v-model="localCode"
      class="code-textarea"
      placeholder="코드를 입력하세요..."
      spellcheck="false"
    ></textarea>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

// Props 정의
const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'JAVA'
  }
})

// Emits 정의
const emit = defineEmits(['update:code'])

/**
 * v-model을 위한 computed 속성
 * 부모 컴포넌트와 양방향 데이터 바인딩
 */
const localCode = computed({
  get: () => props.code,
  set: (value) => emit('update:code', value)
})
</script>

<style lang="scss" scoped>
.code-input {
  height: 310px;
  padding: 15px 20px;
  
  .code-textarea {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    font-family: 'Courier New', 'Monaco', monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    background: transparent;
    
    &::placeholder {
      color: #999;
    }
  }
}
</style>
