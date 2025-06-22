<template>
  <div class="comment-list">
    <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :reply-input-visible="replyInputVisible"
        @reply="handleReply"
        @like="$emit('like', $event)"
        @chat="$emit('chat', $event)"
        @report="$emit('report', $event)"
        @submit-reply="handleSubmitReply"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import CommentItem from './CommentItem.vue'

defineProps({
  comments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['reply', 'like', 'chat', 'report', 'submit-reply'])

// 대댓글 입력창 상태 관리
const replyInputVisible = ref(null)

const handleReply = (comment) => {
  // 대댓글 입력창 토글
  if (replyInputVisible.value === comment.id) {
    replyInputVisible.value = null
  } else {
    replyInputVisible.value = comment.id
  }

  emit('reply', comment)
}

const handleSubmitReply = (data) => {
  // 대댓글 등록 후 입력창 닫기
  replyInputVisible.value = null
  emit('submit-reply', data)
}
</script>

<style lang="scss" scoped>
.comment-list {
  width: 100%;
}
</style>