<template>
  <div class="replies-wrapper">
    <ReplyItem
        v-for="reply in replies.filter(r => r.parentId === parentId)"
        :key="reply.id"
        :reply="reply"
        :replies="replies"
        :parent-id="reply.id"
        @like="$emit('like', $event)"
        @chat="$emit('chat', $event)"
        @report="$emit('report', $event)"
        @edit="handleEdit"
        @submit-edit="handleSubmitEdit"
        @close-edit="handleCloseEdit"
        @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import ReplyItem from './ReplyItem.vue'

defineProps({
  replies: Array,
  parentId: [Number, String]  // 부모 댓글의 ID
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

// 수정 입력창 상태 관리
const editInputVisible = ref(null)

// 수정 버튼 클릭 핸들러
const handleEdit = (reply) => {
  // 수정 입력창 토글
  if (editInputVisible.value === reply.id) {
    editInputVisible.value = null
  } else {
    editInputVisible.value = reply.id
  }

  emit('edit', reply)
}

// 수정 등록 핸들러
const handleSubmitEdit = (data) => {
  // 수정 등록 후 입력창 닫기
  editInputVisible.value = null
  emit('submit-edit', data)
}

// 수정 창 닫기 핸들러
const handleCloseEdit = () => {
  console.log('Closing edit form...') // 디버깅용
  editInputVisible.value = null
}
</script>

<style lang="scss" scoped>
.replies-wrapper {
  margin-top: 5px;
  .reply-item {
    margin-left: 36px;
    &:first-child {
      margin-top: 15px;
    }
  }
}
</style>