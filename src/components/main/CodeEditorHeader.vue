<template>
  <div class="code-editor-header">
    <span class="file-name">Solution.java(하드코딩, 파일이름 항상 고정)</span>
  </div>
</template>

<script setup>
// This component represents the fixed filename header as shown in the Figma design
</script>

<style lang="scss" scoped>
.code-editor-header {
  height: 50px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: white;
  
  .file-name {
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #333;
  }
}
</style>
