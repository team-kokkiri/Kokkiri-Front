<template>
  <div class="report-item-wrapper">
    <!-- 아이템 헤더 -->
    <div class="item-header">
      <span class="report-type">{{ getTypeLabel(report.reportType) }}</span>
    </div>
    
    <!-- 신고자 -->
    <div class="info-row">
      <span class="info-text">신고자 : {{ report.reporterNickname }}</span>
    </div>
    
    <!-- 신고 사유 -->
    <div class="info-row">
      <span class="info-text">신고 사유 : {{ getReasonLabel(report.reportReason) }}</span>
    </div>
    
    <!-- 신고 내용 -->
    <div class="info-row">
      <span class="info-text">신고 내용 : {{ report.contentPreview || '내용 없음' }}</span>
    </div>
    
    <!-- 신고 시간 및 버튼들 -->
    <div class="info-row bottom-row">
      <span class="info-text">신고 시간 : {{ formatDate(report.createdAt) }}</span>
      <div class="button-group">
        <button 
          @click="handlePageMove"
          class="action-button"
        >
          페이지 이동
        </button>
        <button 
          v-if="isPending"
          @click="handleProcess"
          class="action-button"
          :disabled="isProcessing"
        >
          처리 완료
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

// ===== Props & Emits =====
const props = defineProps({
  report: {
    type: Object,
    required: true
  },
  isPending: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['process'])

// ===== 상태 관리 =====
const isProcessing = ref(false)

// ===== 헬퍼 함수 =====
function getTypeLabel(type) {
  const labels = {
    'POST': '게시글',
    'COMMENT': '댓글',
    'USER': '사용자'
  }
  return labels[type] || type
}

function getReasonLabel(reasonCode) {
  const reasons = {
    'INAPPROPRIATE_CONTENT': '게시판 성격에 부적절함',
    'ABUSIVE_LANGUAGE': '욕설/비하',
    'INAPPROPRIATE_MEETING': '음란물/불건전한 만남 및 대화',
    'COMMERCIAL_AD': '상업적 광고 및 판매',
    'LEAK_OR_FRAUD': '유출/사칭/사기',
    'TROLLING_OR_SPAM': '낚시/놀람/도배',
    'POLITICAL_CONTENT': '정당/정치인 비하 및 선거운동',
    'ILLEGAL_CONTENT': '불법촬영물 등의 유통'
  }
  return reasons[reasonCode] || reasonCode
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  // 1분 미만
  if (diff < 60000) {
    return '방금 전'
  }
  
  // 1시간 미만
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}분 전`
  }
  
  // 24시간 미만
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}시간 전`
  }
  
  // 그 이상
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// ===== 이벤트 핸들러 =====
async function handleProcess() {
  if (isProcessing.value) return
  
  isProcessing.value = true
  emit('process', props.report.reportId)
  
  // 처리 완료 후 상태 리셋 (부모 컴포넌트에서 처리)
  setTimeout(() => {
    isProcessing.value = false
  }, 1000)
}

function handlePageMove() {
  const { reportType, targetId, boardId, boardTypeId } = props.report

  // 게시판 경로 매핑 함수
  function getBoardUrl(boardTypeId, boardId) {
    if (boardTypeId === 1) {
      return `/main-page/free-board/${boardId}`
    } else if (boardTypeId === 2) {
      return `/main-page/share-board/${boardId}`
    } else if (boardTypeId === 4) {
      return `/main-page/notice/${boardId}`
    } else if (boardTypeId === 5) {
      return `/main-page/project-board/${boardId}`
    } else {
      return `/main-page/free-board/${boardId}` // 기본값 (예외처리)
    }
  }

  if (reportType === 'POST') {
    // 게시글 이동
    window.open(getBoardUrl(boardTypeId, targetId), '_blank')
  } else if (reportType === 'COMMENT') {
    // 댓글이 달린 게시글로 이동 (글 상세로 이동)
    window.open(getBoardUrl(boardTypeId, boardId), '_blank')
  }
}

</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.report-item-wrapper {
  width: 775px;
  height: 210px;
  position: relative;
  border-bottom: 1px solid $dim-gray;
  
  &:last-child {
    border-bottom: none;
  }

  // 아이템 헤더
  .item-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid $dim-gray;
    display: flex;
    align-items: center;
    padding: 0 20px;

    .report-type {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $crimson;
    }
  }

  // 각 정보 행
  .info-row {
    position: absolute;
    left: 0;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 20px;

    // 신고자
    &:nth-child(2) {
      top: 50px;
    }

    // 신고 사유
    &:nth-child(3) {
      top: 90px;
    }

    // 신고 내용
    &:nth-child(4) {
      top: 130px;
    }

    // 신고 시간 및 버튼들
    &:nth-child(5) {
      top: 170px;
    }

    .info-text {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 16px;
      line-height: 1.252;
      color: $dim-black;
    }

    // 마지막 행 (신고 시간 및 버튼들)
    &.bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .button-group {
        display: flex;
        gap: 12px;

        .action-button {
          padding: 5px 15px;
          height: 31px;
          background: $main-color;
          border: none;
          border-radius: 15px;
          font-family: $secondary-kr;
          font-weight: 500;
          font-size: 16px;
          line-height: 1.252;
          color: $white;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: darken($main-color, 10%);
          }

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
