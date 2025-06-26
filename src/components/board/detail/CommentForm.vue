<template>
  <form class="comment-input" @submit.prevent="handleSubmit">
    <input
        type="text"
        class="input-comment"
        v-model="commentText"
        placeholder="댓글을 입력하세요."
    />
    <button type="submit" class="btn-submit">
      <i class="bi bi-vector-pen"></i>
    </button>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['submit'])

const commentText = ref('')

const handleSubmit = () => {
  if (!commentText.value.trim()) return

  emit('submit', {
    comment: commentText.value,
    createdAt: new Date().toISOString()
  })

  // 입력창 초기화
  commentText.value = ''
}
</script>

<style lang="scss" scoped>
.comment-input {
  display: flex;
  width: 832px;
  height: 40px;
  background-color: #f5f5f5;
  border-top: 1px solid #dddddd;

  .input-comment {
    flex: 1;
    padding: 12px 15px;
    border: none;
    background: transparent;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 13px;
    font-weight: 350;
    color: #686868;
    outline: none;
    line-height: 1.2;

    &::placeholder {
      color: #686868;
    }
  }

  .btn-submit {
    width: 40px;
    height: 40px;
    background-color: #2196f3;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      color: #ffffff;
      font-size: 16px;
    }

    &:hover {
      background-color: #1976d2;
    }
  }
}
</style>