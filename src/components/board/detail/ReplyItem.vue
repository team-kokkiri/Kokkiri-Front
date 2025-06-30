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
        <!-- 신고 버튼 및 모달 -->
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
import { ref } from 'vue'
import axios from 'axios'
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

// 신고 모달 관련 상태 및 함수
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
      targetId: props.reply.id,
      reportType: 'REPLY',
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
.report-wrapper {
  position: relative;

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
}
</style>