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
        <button class="btn-chat" @click="openChatModal">채팅</button>
        <button class="btn-report" @click="openReportModal">신고</button>
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
import { ref, defineProps, defineEmits } from 'vue'
import defaultAvatar from '@/assets/img/0.png'
import EditForm from './EditForm.vue'
import ReplyList from './ReplyList.vue'
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ReportModal from '@/components/common/ReportModal.vue'
import ChatInviteModal from '@/components/common/ChatInviteModal.vue'

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

// 모달 열기 함수
function openChatModal() {
  if (userStore.memberId == props.reply.memberId) {
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
