<template>
  <div class="post-header">
    <div class="header-avatar">
      <img class="avatar" :src="post.avatarUrl || defaultAvatar" alt="아바타" />
    </div>
    <div class="header-info">
      <span class="nickname">{{ post.writer }}</span>
      <span class="date">{{ formatDate(post.boardCreatedAt) }}</span>
    </div>
    <div class="header-actions">
      <button class="btn-edit" @click="$emit('edit', post)">수정</button>
      <button class="btn-delete" @click="$emit('delete', post)">삭제</button>
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

  <!-- 채팅 시작 확인 모달 -->
  <div v-if="isChatModalOpen" class="modal-overlay" @click.self="closeChatModal">
    <div class="modal-content">
      <p class="modal-text">
        <strong>{{ post.writer }}</strong>님에게 채팅을 거시겠습니까?
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
import defaultAvatar from '@/assets/img/0.png'
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['chat', 'report', 'edit', 'delete'])

const router = useRouter()
const userStore = useUserStore()

// 날짜 포맷터
function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ----------- 신고 기능 관련 -----------
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
    const token = localStorage.getItem('accessToken')
    const response = await axios.post('/api/reports', {
      targetId: props.post.id,
      reportType: 'POST',
      reportReason: selectedReason.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (![200, 201].includes(response.status)) {
      alert('신고 제출에 실패했습니다. 다시 시도해주세요.')
      return
    }
    alert('신고가 접수되었습니다.')
    showReportPopup.value = false
    selectedReason.value = ''
    emit('report', props.post.id)
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
  if (confirm('해당 게시글을 신고하시겠습니까?')) {
    submitReport()
  }
}

// ----------- 1:1 채팅 기능 관련 -----------
const isChatModalOpen = ref(false)

function openChatModal() {
  if (userStore.nickname == props.post.writer) {
    alert("자기 자신과는 채팅할 수 없습니다.")
    return
  }
  isChatModalOpen.value = true
}

function closeChatModal() {
  isChatModalOpen.value = false
}

async function startPrivateChat() {
  if (!props.post.writer) {
    alert("채팅을 시작할 수 없습니다.")
    closeChatModal()
    return
  }
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      alert("로그인이 필요합니다.")
      return
    }
    const response = await axios.post('/api/chat/room/private/create', null, {
      params: {
        otherMemberId: props.post.memberId
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const roomId = response.data
    if (roomId) {
      router.push({ path: '/main-page/chat', query: { roomId } })
    } else {
      alert("채팅방 정보를 가져오지 못했습니다.")
    }
  } catch (error) {
    console.error("1:1 채팅 시작에 실패했습니다:", error)
    const errorMessage = error.response?.data?.message || "채팅방을 시작하는 중 오류가 발생했습니다."
    alert(errorMessage)
  } finally {
    closeChatModal()
  }
}
</script>


<style lang="scss" scoped>
.post-header {
  display: flex;
  align-items: center;

  .header-avatar {
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      object-fit: cover;
    }
  }

  .header-info {
    margin-left: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;

    .nickname {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #333333;
      line-height: 1.2;
    }

    .date {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 12px;
      font-weight: 350;
      color: #999999;
      line-height: 1.2;
    }
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.report-wrapper {
  position: relative;

  .report-popup {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  select {
    padding: 4px;
  }

  button {
    padding: 4px 8px;
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

.btn-report {
  margin-bottom: 1.5px;
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
</style>