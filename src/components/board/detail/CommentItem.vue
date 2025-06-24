<template>
  <div class="comment-item">
    <!-- 댓글 프로필 -->
    <div class="comment-profile">
      <div class="profile-info">
        <img class="avatar" :src="comment.avatar || defaultAvatar" alt="아바타" />
        <span class="nickname">{{ comment.memberNickname }}</span>
      </div>
      <div class="comment-actions">
        <button class="btn-edit" @click="$emit('edit', comment)">수정</button>
        <button class="btn-delete" @click="$emit('delete', comment)">삭제</button>
        <button class="btn-reply" @click="$emit('reply', comment)">대댓글</button>
        <button class="btn-like" @click="$emit('like', comment)">공감</button>
        <button class="btn-chat" @click="$emit('chat', comment)">채팅</button>
        <button class="btn-report" @click="$emit('report', comment)">신고</button>
      </div>
    </div>

    <!-- 댓글 본문 -->
    <div class="comment-body">
      <p class="comment-text">{{ comment.comment }}</p>
    </div>

    <!-- 댓글 메타 정보 -->
    <div class="comment-meta">
      <span class="date">{{ formatDate(comment.commentCreatedAt) }}</span>
        <span class="comment-likes" v-if="comment.likeCount > 0">
          <i
            :class="comment.liked ? 'bi bi-hand-thumbs-up-fill' : 'bi bi-hand-thumbs-up'"
          ></i>
        <span class="like-count">{{ comment.likeCount }}</span>
      </span>
    </div>
    <!-- 수정 입력창 -->
    <EditForm
        v-if="editInputVisible === comment.id"
        :item="comment"
        item-type="comment"
        @submit="$emit('submit-edit', $event)"
        @close="$emit('close-edit', $event)"
    />
    <!-- 대댓글 리스트 -->
    <ReplyList
        v-if="allReplies.some(r => r.parentId === comment.id)"
        :replies="allReplies"
        :parent-id="comment.id"
        @like="$emit('like', $event)"
        @chat="$emit('chat', $event)"
        @report="$emit('report', $event)"
        @delete="$emit('delete', $event)"
    />

    <!-- 대댓글 입력창 -->
    <ReplyForm
        v-if="replyInputVisible === comment.id"
        :comment-id="comment.id"
        @submit="$emit('submit-reply', $event)"
        @close="$emit('close-reply', $event)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ReplyList from './ReplyList.vue'
import ReplyForm from './ReplyForm.vue'
import defaultAvatar from '@/assets/img/0.png'
import EditForm from './EditForm.vue'

defineProps({
  comment: Object,
  replyInputVisible: [Number, String, null],
  allReplies: {
    type: Array,
    default: () => []
  }
})

console.log('allReplies')

defineEmits([
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

// 날짜 포맷터
function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.comment-item {
  padding: 15px 15px 0 15px;

  .comment-profile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

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

      .btn-reply,
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

    .comment-text {
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