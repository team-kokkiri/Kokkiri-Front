<template>
  <div class="post-reaction-bar">
    <span class="reaction likes">
      <i class="bi bi-hand-thumbs-up"></i>
      <em>{{ post.likeCount || 0 }}</em>
    </span>
    <span class="reaction comments">
      <i class="bi bi-chat"></i>
      <em>{{ post.commentCount || 0 }}</em>
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.post-reaction-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px;

  .reaction {
    display: flex;
    align-items: center;
    gap: 7px;

    &.likes {
      i {
        color: #ed2040;
        font-size: 14px;
        font-weight: 500;
      }

      em {
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 12px;
        font-weight: 500;
        color: #ed2040;
        font-style: normal;
      }
    }

    &.comments {
      i {
        color: #2196f3;
        font-size: 14px;
      }

      em {
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 12px;
        font-weight: 400;
        color: #2196f3;
        font-style: normal;
        opacity: 0.9;
      }
    }
  }
}
</style>