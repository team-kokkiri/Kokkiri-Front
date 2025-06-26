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
        :edit-input-visible="editInputVisible"
        @reply="handleReply"
        @like="$emit('like', $event)"
        @chat="$emit('chat', $event)"
        @report="$emit('report', $event)"
        @submit-reply="handleSubmitReply"
        @close-reply="handleCloseReply"
        @edit="handleEdit"
        @submit-edit="handleSubmitEdit"
        @close-edit="handleCloseEdit"
        @delete="$emit('delete', $event)"
      />
    </template>

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

const emit = defineEmits([
  'edit',
  'delete',
  'reply',
  'like',
  'chat',
  'report',
  'submit-edit',
  'close-edit',
  'submit-reply',
  'close-reply'
])

// 대댓글 입력창 상태 관리
const replyInputVisible = ref(null)

// 수정 입력창 상태 관리
const editInputVisible = ref(null)

// 대댓글 버튼 클릭 핸들러
const handleReply = (comment) => {
  // 수정창이 열려있으면 닫기
  editInputVisible.value = null

  // 대댓글 입력창 토글
  if (replyInputVisible.value === comment.id) {
    replyInputVisible.value = null
  } else {
    replyInputVisible.value = comment.id
  }

  emit('reply', comment)
}

// 수정 버튼 클릭 핸들러
const handleEdit = (item) => {
  // 대댓글창이 열려있으면 닫기
  replyInputVisible.value = null

  // 수정 입력창 토글
  if (editInputVisible.value === item.id) {
    editInputVisible.value = null
  } else {
    editInputVisible.value = item.id
  }

  emit('edit', item)
}

// 대댓글 등록 핸들러
const handleSubmitReply = (data) => {
  // 대댓글 등록 후 입력창 닫기
  replyInputVisible.value = null
  emit('submit-reply', data)
}

// 수정 등록 핸들러
const handleSubmitEdit = (data) => {
  // 수정 등록 후 입력창 닫기
  editInputVisible.value = null
  emit('submit-edit', data)
}

// 대댓글 창 닫기 핸들러
const handleCloseReply = () => {
  console.log('Closing reply form...') // 디버깅용
  replyInputVisible.value = null
}

// 수정 창 닫기 핸들러
const handleCloseEdit = () => {
  console.log('Closing edit form...') // 디버깅용
  editInputVisible.value = null
}
</script>

<style lang="scss" scoped>
.comment-list {
  width: 100%;
}
</style>