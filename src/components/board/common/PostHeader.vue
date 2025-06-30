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
      <button class="btn-chat" @click="$emit('chat', post)">채팅</button>
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
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import axios from 'axios'
import defaultAvatar from '@/assets/img/0.png'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
defineEmits(['chat', 'report', 'edit', 'delete'])

// 날짜 포맷터
function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

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
    console.log('Submitting report with:', {
      targetId: props.post.id,
      reportType: 'POST',
      reportReason: selectedReason.value
    })
    const response = await axios.post(`${API_BASE_URL}/api/reports`, {
      targetId: props.post.id,
      reportType: 'POST',
      reportReason: selectedReason.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log('Report response:', response)
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
  if (confirm('해당 게시글을 신고하시겠습니까?')) {
    submitReport()
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
</style>