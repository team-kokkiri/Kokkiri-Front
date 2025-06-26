<template>
  <div class="reply-item">
    <!-- 대댓글 프로필 -->
    <div class="comment-profile">
      <div class="profile-info">
        <img class="avatar" :src="reply.avatar || defaultAvatar" alt="아바타" />
        <span class="nickname">{{ reply.memberNickname }}</span>
      </div>
      <div class="comment-actions">
        <button class="btn-edit" @click="$emit('edit', reply)">수정</button>
        <button class="btn-delete" @click="$emit('delete', reply)">삭제</button>
        <button class="btn-like" @click="$emit('like', reply)">공감</button>
        <button class="btn-chat" @click="$emit('chat', reply)">채팅</button>
        <button class="btn-report" @click="$emit('report', reply)">신고</button>
      </div>
    </div>

    <!-- 대댓글 본문 -->
    <div class="comment-body">
      <p class="reply-text">{{ reply.comment }}</p>
    </div>

    <!-- 대댓글 메타 정보 -->
    <ReplyList
      v-if="replies.some(r => r.parentId === reply.id)"
      :replies="replies"
      :parent-id="reply.id"
      @like="$emit('like', $event)"
      @chat="$emit('chat', $event)"
      @report="$emit('report', $event)"
      @edit="$emit('edit', $event)"
      @submit-edit="$emit('submit-edit', $event)"
      @close-edit="$emit('close-edit')"
      @delete="$emit('delete', $event)"
    />
  </div>
  <!-- 수정 입력창 -->
  <EditForm
      v-if="props.editInputVisible === reply.id"
      :item="reply"
      item-type="reply"
      @submit="$emit('submit-edit', $event)"
      @close="handleCloseEdit"
  />
</template>


<script setup>
import { defineProps, defineEmits } from 'vue'
import defaultAvatar from '@/assets/img/0.png'
import EditForm from './EditForm.vue'
import ReplyList from './ReplyList.vue'

const props = defineProps({
  reply: {
    type: Object,
    required: true
  },
  editInputVisible: {
    type: [Number, String, null],
    default: null
    },
  replies: {
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

// 날짜 포맷터
// function formatDate(str) {
//   if (!str) return ''
//   const d = new Date(str)
//   return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
// }

// 수정 창 닫기 핸들러
const handleCloseEdit = () => {
  console.log('EditForm close event received') // 디버깅용
  emit('close-edit')
}

</script>

<style lang="scss" scoped>
.reply-item {
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #dddddd;
  margin-left: 36px;

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