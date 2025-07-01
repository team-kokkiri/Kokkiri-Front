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
        <button class="btn-chat" @click="openChatModal">채팅</button>
        <div class="report-wrapper">
          <button class="btn-report" @click="showReportPopup = !showReportPopup">신고</button>
          <div v-if="showReportPopup" class="modal-overlay">
            <div class="modal">
              <div class="modal-header">
                <h3>신고 사유 선택</h3>
                <button class="close-btn" @click="showReportPopup = false">×</button>
              </div>
              <ul class="reason-list">
                <li
                  v-for="reason in reportReasons"
                  :key="reason.value"
                  :class="{ selected: selectedReason === reason.value }"
                  @click="selectedReason = reason.value"
                >
                  {{ reason.label }}
                </li>
              </ul>
              <div class="modal-actions">
                <button @click="confirmReport">신고</button>
              </div>
            </div>
          </div>
        </div>
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

  <!-- 채팅 시작 확인 모달 -->
  <div v-if="isChatModalOpen" class="modal-overlay" @click.self="closeChatModal">
    <div class="modal-content">
      <p class="modal-text">
        <strong>{{ comment.memberNickname }}</strong>님에게 채팅을 거시겠습니까?
      </p>
      <div class="modal-actions">
        <button class="btn-modal btn-cancel" @click="closeChatModal">아니오</button>
        <button class="btn-modal btn-confirm" @click="startPrivateChat">네</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import ReplyList from './ReplyList.vue'
import ReplyForm from './ReplyForm.vue'
import defaultAvatar from '@/assets/img/0.png'
import EditForm from './EditForm.vue'
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  comment: Object,
  replyInputVisible: [Number, String, null],
  editInputVisible: [Number, String, null],
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

const router = useRouter();
const userStore = useUserStore();
const isChatModalOpen = ref(false);

// 모달 열기 함수
function openChatModal() {
  if (userStore.memberId === props.comment.memberId) {
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

const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'

const reportReasons = [
  { label: '게시판 성격에 부적절함', value: 'INAPPROPRIATE_CONTENT' },
  { label: '욕설/비하', value: 'ABUSIVE_LANGUAGE' },
  { label: '음란물/불건전한 만남 및 대화', value: 'INAPPROPRIATE_MEETING' },
  { label: '상업적 광고 및 판매', value: 'COMMERCIAL_AD' },
  { label: '유출/사칭/사기', value: 'LEAK_OR_FRAUD' },
  { label: '낚시/놀람/도배', value: 'TROLLING_OR_SPAM' },
  { label: '정당/정치인 비하 및 선거운동', value: 'POLITICAL_CONTENT' },
  { label: '불법촬영물 등의 유통', value: 'ILLEGAL_CONTENT' }
]
const selectedReason = ref('')
const showReportPopup = ref(false)

async function submitReport() {
  if (!selectedReason.value) {
    alert('신고 사유를 선택해주세요.')
    return
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/api/reports`, {
      targetId: props.comment.id,
      reportType: 'COMMENT',
      reportReason: selectedReason.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status !== 200 && response.status !== 201) {
      alert('신고 제출에 실패했습니다. 다시 시도해주세요.')
      return
    }
    alert('신고가 접수되었습니다.')
    showReportPopup.value = false
    selectedReason.value = ''
  } catch (err) {
    console.error('신고 실패:', err)
    alert('신고 처리 중 오류가 발생했습니다.')
  }
}

function confirmReport() {
  if (!selectedReason.value) {
    alert('신고 사유를 선택해주세요.')
    return
  }
  if (confirm('해당 댓글을 신고하시겠습니까?')) {
    submitReport()
  }
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
.report-wrapper {
  position: relative;

  .btn-report {
    margin-bottom: 5px;
  }
}
/* 모달 스타일 추가 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 320px;
}
.modal-text {
  font-size: 16px;
  margin: 0 0 20px;
  color: #333;
  line-height: 1.5;
  strong {
    font-weight: 700;
  }
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.btn-modal {
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 80px;
}
.btn-confirm {
  background-color: #5a7dff; // 메인 컬러
  color: white;
  &:hover {
    background-color: darken(#5a7dff, 10%);
  }
}
.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
}

  .report-wrapper {
    position: relative;

    .btn-report {
      margin-bottom: 5px;
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: #fff;
    padding: 20px;
    width: 420px;
    border-radius: 10px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
  }

  .reason-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;

    li {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      cursor: pointer;
    }

    li.selected {
      font-weight: bold;
    }
  }

  .modal-actions {
    text-align: right;

    button {
      padding: 6px 12px;
    }
  }
</style>