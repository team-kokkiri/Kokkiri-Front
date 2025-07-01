<template>
  <div class="activity-section">
    <div
        class="activity-item"
        @click="$emit('activity-click', { id: 'my-posts', route: '/main-page/my-written-posts' })"
    >
      <i class="bi bi-list-ul"></i>
      <span class="text">내가 쓴 글</span>
    </div>
    <div
        class="activity-item"
        @click="$emit('activity-click', { id: 'my-comments', route: '/main-page/my-commented-posts' })"
    >
      <i class="bi bi-chat"></i>
      <span class="text">댓글 단 글</span>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

// Emits
defineEmits(['activity-click'])
</script>

<style lang="scss" scoped>
.activity-section {
  display: flex;
  flex-direction: column;

  .activity-item {
    width: 173px;
    height: 40px;
    background-color: #F5F5F5;
    border: 1px solid #DDDDDD;
    border-top: 0;
    display: flex;
    align-items: center;
    gap: 15px;
    padding-left: 20px;
    color: #333333;
    cursor: pointer;
    transition: all 0.2s ease;

    &:first-child {
      border-top: 1px solid #DDDDDD;
    }

    &:hover {
      color: #333333;
    }

    &:active {
      transform: translateY(2px);
    }

    i {
      font-size: 16px;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:nth-child(1) i {
      color: #2196F3;
    }

    &:nth-child(2) i {
      color: #2ECC71;
    }

    &:nth-child(3) i {
      color: #FFD912;
    }

    .text {
      font-family: 'SpoqaHanSansNeo-Regular', sans-serif;
      font-weight: normal;
      font-size: 14px;
      line-height: 1.143;
      color: #333333;
    }
  }
}
</style>