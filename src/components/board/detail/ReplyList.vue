<template>
  <div class="replies-wrapper">
    <ReplyItem
        v-for="reply in replies"
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
  replies: {
    type: Array,
    default: () => []
  }
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