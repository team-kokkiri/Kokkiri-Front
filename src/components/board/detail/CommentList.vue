<template>
  <div class="comment-list">
    <!-- 댓글이 존재할 때만 렌더링 -->
    <template v-if="comments && comments.length">
      <CommentItem
        v-for="comment in comments.filter(c => !c.parentId)"
        :key="comment.id"
        :comment="comment"
        :allReplies="comments"
        :reply-input-visible="replyInputVisible"
        @reply="handleReply"
        @like="$emit('like', $event)"
        @chat="$emit('chat', $event)"
        @report="$emit('report', $event)"
        @submit-reply="handleSubmitReply"
        @close-reply="handleCloseReply"
      />
    </template>

    <!-- 댓글이 없을 때 -->
    <div v-else class="no-comments">
      등록된 댓글이 없습니다.
    </div>
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

// 대댓글 창 닫기 핸들러 추가
const handleCloseReply = () => {
  console.log('Closing reply form...') // 디버깅용
  replyInputVisible.value = null
}
</script>

<style lang="scss" scoped>
.comment-list {
  width: 100%;
}
</style>