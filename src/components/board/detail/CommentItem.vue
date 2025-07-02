<template>
  <div class="comment-item">
    <!-- 댓글 프로필 -->
    <div class="comment-profile">
      <div class="profile-info">
        <img class="avatar" :src="getProfileImageUrl(comment.memberAvatar)" alt="아바타" @error="handleImageError" />
        <span class="nickname">{{ comment.memberNickname }}</span>
      </div>
      <div class="comment-actions">
        <button class="btn-edit" @click="$emit('edit', comment)">수정</button>
        <button class="btn-delete" @click="$emit('delete', comment)">삭제</button>
        <button class="btn-reply" @click="$emit('reply', comment)">대댓글</button>
        <button class="btn-like" @click="$emit('like', comment)">공감</button>
        <button class="btn-chat" @click="openChatModal">채팅</button>
        <button class="btn-report" @click="openReportModal">신고</button>
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
        v-if="props.editInputVisible === comment.id"
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
        @edit="$emit('edit', $event)"
        @submit-edit="$emit('submit-edit', $event)"
        @close-edit="$emit('close-edit', $event)"
        @delete="$emit('delete', $event)"
    />

    <!-- 대댓글 입력창 -->
    <ReplyForm
        v-if="props.replyInputVisible === comment.id"
        :comment-id="comment.id"
        @submit="$emit('submit-reply', $event)"
        @close="$emit('close-reply', $event)"
    />
  </div>

  <!-- 채팅 초대 모달 -->
  <ChatInviteModal
    :visible="isChatModalOpen"
    :target-nickname="comment.memberNickname"
    @confirm="startPrivateChat"
    @cancel="closeChatModal"
    @close="closeChatModal"
  />

  <!-- 신고 모달 -->
  <ReportModal
    :visible="isReportModalOpen"
    :target-id="comment.id"
    report-type="COMMENT"
    @close="closeReportModal"
    @success="handleReportSuccess"
  />
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import ReplyList from './ReplyList.vue'
import ReplyForm from './ReplyForm.vue'
import { getProfileImageUrl, handleImageError } from '@/utils/profileImage'
import EditForm from './EditForm.vue'
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ReportModal from '@/components/common/modal/ReportModal.vue'
import ChatInviteModal from '@/components/common/modal/ChatInviteModal.vue'

const props = defineProps({
  comment: Object,
  replyInputVisible: [Number, String, null],
  editInputVisible: [Number, String, null],
  allReplies: {
    type: Array,
    default: () => []
  }
})

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

const router = useRouter();
const userStore = useUserStore();
const isChatModalOpen = ref(false);

// 모달 열기 함수
function openChatModal() {
  if (userStore.id === props.comment.memberId) {
    alert("자기 자신과는 채팅할 수 없습니다.");
    return;
  }
  isChatModalOpen.value = true;
}

// 모달 닫기 함수
function closeChatModal() {
  isChatModalOpen.value = false;
}

// 1:1 채팅 시작 함수
async function startPrivateChat() {
  if (!props.comment.memberId) {
    console.error("댓글 작성자 ID를 찾을 수 없습니다.");
    alert("채팅을 시작할 수 없습니다.");
    closeChatModal();
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }

    const response = await axios.post('/api/chat/room/private/create', null, {
        params: {
            otherMemberId: props.comment.memberId
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const roomId = response.data;
    if (roomId) {
        router.push({ path: '/main-page/chat', query: { roomId: roomId } });
    } else {
        alert("채팅방 정보를 가져오지 못했습니다.");
    }

  } catch (error) {
    console.error("1:1 채팅 시작에 실패했습니다:", error);
    const errorMessage = error.response?.data?.message || "채팅방을 시작하는 중 오류가 발생했습니다.";
    alert(errorMessage);
  } finally {
    closeChatModal();
  }
}

// 날짜 포맷터
function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ----------- 신고 기능 관련 -----------
const isReportModalOpen = ref(false)

function openReportModal() {
  isReportModalOpen.value = true
}

function closeReportModal() {
  isReportModalOpen.value = false
}

function handleReportSuccess() {
  // 필요시 부모 컴포넌트로 신고 성공 이벤트 전달
}
</script>

<style lang="scss" scoped>
.comment-item {
  padding: 15px 15px 0 15px;
  position: relative; // 모달을 위한 포지셔닝 컨텍스트

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
      .btn-report,
      .btn-edit,
      .btn-delete {
        font-family: 'Spoqa Han Sans Neo', sans-serif;
        font-size: 12px;
        font-weight: 500;
        color: #999999;
        background: transparent;
        border: none;
        cursor: pointer;
        line-height: 1.252;
        padding: 2px 4px;

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
