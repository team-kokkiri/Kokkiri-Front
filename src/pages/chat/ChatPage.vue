<template>
  <div class="page-container">
    <ChatRoom />
  </div>
</template>

<script setup>
import ChatRoom from '@/components/chat/ChatRoom.vue'; // ChatRoom 컴포넌트의 경로
</script>

<style scoped>
.page-container {
  /* 페이지 전체를 감싸는 스타일에 맞게 조정 */
  display: flex;
  justify-content: center;
  padding: 20px;
}
</style>