<template>
  <div class="reply-item">
    <!-- 대댓글 프로필 -->
    <div class="comment-profile">
      <div class="profile-info">
        <img class="avatar" :src="getProfileImageUrl(reply.memberAvatar)" alt="아바타" @error="handleImageError" />
        <span class="nickname">{{ reply.memberNickname }}</span>
      </div>
      <div class="comment-actions">
        <!-- 수정: 작성한 본인만 보여지게 -->
        <button v-if="isOwner" class="btn-edit" @click="$emit('edit', reply)">수정</button>
        <!-- 삭제: 작성한 본인과 관리자한테 보여지게 -->
        <button v-if="isOwner || userStore.isAdmin" class="btn-delete" @click="$emit('delete', reply)">삭제</button>
        <!-- 공감: 본인이 작성한 거는 안보여지게 (남이 작성한 거에만 보여지게) -->
        <button v-if="!isOwner" class="btn-like" @click="$emit('like', reply)">공감</button>
        <!-- 채팅: 본인이 작성한 거는 안보여지게 (남이 작성한 거에만 보여지게) -->
        <button v-if="!isOwner" class="btn-chat" @click="openChatModal">채팅</button>
        <!-- 신고: 본인이 작성한 거는 안보여지게 (남이 작성한 거에만 보여지게) -->
        <button v-if="!isOwner" class="btn-report" @click="openReportModal">신고</button>
      </div>
    </div>

    <!-- 대댓글 본문 -->
    <div class="comment-body">
      <p class="reply-text">{{ reply.comment }}</p>
    </div>

    <!-- 대댓글 메타 정보 -->
    <div class="comment-meta">
      <span class="date">{{ formatDate(reply.commentCreatedAt) }}</span>
      <span class="comment-likes" v-if="reply.likeCount > 0">
        <i
          :class="reply.liked ? 'bi bi-hand-thumbs-up-fill' : 'bi bi-hand-thumbs-up'"
        ></i>
        <span class="like-count">{{ reply.likeCount }}</span>
      </span>
    </div>

    <!-- 중첩 대댓글 리스트 -->
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

  <!-- 채팅 초대 모달 -->
  <ChatInviteModal
    :visible="isChatModalOpen"
    :target-nickname="reply.memberNickname"
    @confirm="startPrivateChat"
    @cancel="closeChatModal"
    @close="closeChatModal"
  />

  <!-- 신고 모달 -->
  <ReportModal
    :visible="isReportModalOpen"
    :target-id="reply.id"
    report-type="REPLY"
    @close="closeReportModal"
    @success="handleReportSuccess"
  />
</template>


<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { getProfileImageUrl, handleImageError } from '@/utils/profileImage'
import EditForm from './EditForm.vue'
import ReplyList from './ReplyList.vue'
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ReportModal from '@/components/common/modal/ReportModal.vue'
import ChatInviteModal from '@/components/common/modal/ChatInviteModal.vue'

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

const router = useRouter();
const userStore = useUserStore();
const isChatModalOpen = ref(false);

// 작성자인지 확인하는 computed
const isOwner = computed(() => {
  // memberId로 비교 (숫자 비교)
  if (props.reply.memberId && userStore.id) {
    return props.reply.memberId === userStore.id
  }
  // nickname으로 비교 (fallback)
  return props.reply.memberNickname === userStore.nickname
})

// 모달 열기 함수 (디버깅 코드 추가)
function openChatModal() {
  console.log(`[채팅 시작 시도] 현재 사용자 ID: ${userStore.id}, 댓글 작성자 ID: ${props.reply.memberId}`);

  // 댓글 작성자 ID가 없는 경우를 방어
  if (props.reply.memberId === undefined || props.reply.memberId === null) {
      alert("댓글 작성자 정보를 찾을 수 없어 채팅을 시작할 수 없습니다.");
      return;
  }

  // 본인과는 채팅할 수 없도록 체크
  if (userStore.id == props.reply.memberId) {
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
  if (!props.reply.memberId) {
    console.error("대댓글 작성자 ID를 찾을 수 없습니다.");
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
    console.log(props.reply.memberId)

    const response = await axios.post('/api/chat/room/private/create', null, {
        params: {
            otherMemberId: props.reply.memberId
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

// 수정 창 닫기 핸들러
const handleCloseEdit = () => {
  console.log('EditForm close event received') // 디버깅용
  emit('close-edit')
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
.reply-item {
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #dddddd;
  margin-left: 36px;
  position: relative; // 모달을 위한 포지셔닝 컨텍스트

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

      button {
        font-family: 'Spoqa Han Sans Neo', sans-serif;
        font-size: 12px;
        font-weight: 500;
        color: #999999;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 2px 4px;

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
