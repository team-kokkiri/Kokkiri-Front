<script setup>
import { defineEmits } from 'vue'

defineEmits(['like', 'scrap'])
</script>

<template>
  <div class="post-action-bar">
    <button class="btn-like" @click="$emit('like')">
      <i class="bi bi-hand-thumbs-up"></i>
      공감
    </button>
    <button class="btn-scrap" @click="$emit('scrap')">
      <i class="bi bi-star"></i>
      스크랩
    </button>
  </div>
</template>

<style lang="scss" scoped>
.post-action-bar {
  display: flex;
  gap: 10px;
  margin-top: 15px;

  .btn-like,
  .btn-scrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 5px 8px;
    background-color: #f5f5f5;
    border: none;
    border-radius: 5px;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #555555;
    cursor: pointer;
    height: 25px;

    i {
      font-size: 16px;
    }

    &:hover {
      background-color: #eeeeee;
    }
  }
}
</style>