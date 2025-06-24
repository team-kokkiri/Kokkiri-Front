<template>
  <div class="replies-wrapper">
    <ReplyItem
      v-for="reply in replies.filter(r => r.parentId === parentId)"
      :key="reply.id"
      :reply="reply"
      @like="$emit('like', $event)"
      @chat="$emit('chat', $event)"
      @report="$emit('report', $event)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ReplyItem from './ReplyItem.vue'

defineProps({
  replies: Array,
  parentId: [Number, String]  // 부모 댓글의 ID
})

defineEmits(['like', 'chat', 'report'])
</script>

<style lang="scss" scoped>
.replies-wrapper {
  .reply-item {
    margin-left: 36px;
    &:first-child {
      margin-top: 15px;
    }
  }
}
</style>