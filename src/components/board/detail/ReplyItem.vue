<template>
  <div class="reply-item">
    <!-- 대댓글 프로필 -->
    <div class="comment-profile">
      <div class="profile-info">
        <img class="avatar" :src="reply.avatar || defaultAvatar" alt="아바타" />
        <span class="nickname">{{ reply.writer }}</span>
      </div>
      <div class="comment-actions">
        <button class="btn-like" @click="$emit('like', reply)">공감</button>
        <button class="btn-chat" @click="$emit('chat', reply)">채팅</button>
        <button class="btn-report" @click="$emit('report', reply)">신고</button>
      </div>
    </div>

    <!-- 대댓글 본문 -->
    <div class="comment-body">
      <p class="reply-text">{{ reply.content }}</p>
    </div>

    <!-- 대댓글 메타 정보 -->
    <div class="comment-meta">
      <span class="date">{{ formatDate(reply.createdAt) }}</span>
      <span class="comment-likes" v-if="reply.likeCount > 0">
        <i class="bi bi-hand-thumbs-up"></i>
        <span class="like-count">{{ reply.likeCount }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import defaultAvatar from '@/assets/img/0.png'

defineProps({
  reply: {
    type: Object,
    required: true
  }
})

defineEmits(['like', 'chat', 'report'])

// 날짜 포맷터
function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.reply-item {
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #dddddd;

  .comment-profile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;

    .profile-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .avatar {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        object-fit: cover;
      }

      .nickname {
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 12px;
        font-weight: 700;
        color: #333333;
        line-height: 1.2;
      }
    }

    .comment-actions {
      display: flex;
      gap: 1px;

      .btn-like,
      .btn-chat,
      .btn-report {
        font-family: 'Spoqa Han Sans Neo', sans-serif;
        font-size: 12px;
        font-weight: 500;
        color: #999999;
        background: transparent;
        border: none;
        cursor: pointer;
        line-height: 1.252;

        &:hover {
          color: #333333;
        }
      }
    }
  }

  .comment-body {
    margin-bottom: 8px;

    .reply-text {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #686868;
      line-height: 1.2;
      margin: 0;
    }
  }

  .comment-meta {
    display: flex;
    align-items: center;
    gap: 15px;

    .date {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 12px;
      font-weight: 350;
      color: #999999;
      line-height: 1.2;
    }

    .comment-likes {
      display: flex;
      align-items: center;
      gap: 5px;

      i {
        color: #ed2040;
        font-size: 12px;
      }

      .like-count {
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 12px;
        font-weight: 400;
        color: #ed2040;
      }
    }
  }
}
</style>