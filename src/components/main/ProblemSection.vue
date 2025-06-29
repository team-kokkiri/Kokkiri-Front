<template>
  <div class="problem-section">
    <div class="section-header">
      <h3 class="section-title">{{ title }}</h3>
    </div>
    <div class="section-content">
      <p class="content-text">{{ content || '내용이 없습니다.' }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.problem-section {
  border-bottom: 1px solid #ddd;
  
  &:last-child {
    border-bottom: none;
  }
  
  .section-header {
    padding: 15px 20px 0;
    
    .section-title {
      font-family: 'Spoqa Han Sans Neo', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #333;
      margin: 0 0 10px 0;
    }
  }
  
  .section-content {
    padding: 0 20px 15px;
    
    .content-text {
      font-family: 'Spoqa Han Sans Neo', sans-serif;
      font-weight: 500;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      margin: 0;
      white-space: pre-line;
      word-break: break-word;
    }
  }
}
</style>
