<template>
  <div class="common-board-item" :class="{ 'two-line': isTwoLine }" @click="handleClick">
    <!-- 게시판명 (옵션) -->
    <span v-if="config.showBoardType && displayItem.boardType" class="board-name">
      {{ displayItem.boardType }}
    </span>

    <!-- 제목 -->
    <h3 class="title">{{ displayItem.title }}</h3>

    <!-- 내용 미리보기 (옵션) -->
    <p v-if="config.showPreview && displayItem.preview" class="preview" :class="{ 'two-line': isTwoLine }">
      {{ displayItem.preview }}
    </p>

    <!-- 하단 정보 -->
    <div class="item-info">
      <span class="likes" v-if="displayItem.likeCount > 0">
        <i class="bi bi-hand-thumbs-up"></i>
        <em>{{ displayItem.likeCount }}</em>
      </span>
      <span class="comments" v-if="displayItem.commentCount > 0">
        <i class="bi bi-chat"></i>
        <em>{{ displayItem.commentCount }}</em>
      </span>
      <span class="datetime">{{ formatDate(displayItem.createdTime) }}</span>
      <span v-if="displayItem.writer" class="writer">{{ displayItem.writer }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  config: {
    type: Object,
    default: () => ({
      showBoardType: false,
      showPreview: false
    })
  }
})

// Emits
const emit = defineEmits(['click'])

// 다양한 API 응답 형태를 통일된 형태로 변환
const displayItem = computed(() => {
  const item = props.item
  
  return {
    id: item.id || item.boardId,
    title: item.boardTitle || item.title,
    preview: item.boardContent || item.content || '',
    boardType: item.boardType || '',
    boardTypeId: item.boardTypeId,
    likeCount: item.likeCount || 0,
    commentCount: item.commentCount || 0,
    createdTime: item.createdTime || item.createdAt,
    writer: item.writer || item.writerName || ''
  }
})

// 내용 길이에 따라 2줄 표시 여부 결정
const isTwoLine = computed(() => {
  return props.config.showPreview && displayItem.value.preview && displayItem.value.preview.length > 50
})

// 클릭 핸들러
function handleClick() {
  const itemData = {
    id: displayItem.value.id,
    boardId: displayItem.value.id
  }
  
  // HOT 게시판처럼 route 정보가 필요한 경우
  if (props.item.route) {
    itemData.route = props.item.route
  } else if (displayItem.value.boardTypeId) {
    // boardTypeId를 기반으로 라우트 결정 (기존 HotListItem 로직)
    const boardRoutes = {
      1: 'free-board', // 자유게시판
      2: 'share-board', // 자료공유 게시판
      3: 'question-board', // 질문게시판 (예시)
      4: 'notice', // 공지사항
      5: 'project-board' // 프로젝트 소개
    }
    itemData.route = boardRoutes[displayItem.value.boardTypeId] || 'free-board'
  }
  
  emit('click', itemData)
}

// 날짜 포맷팅
function formatDate(dateString) {
  if (!dateString) return ''

  const now = new Date()
  const date = new Date(dateString)
  const diff = now - date

  // 1시간 미만
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}분 전`
  }

  // 24시간 미만
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}시간 전`
  }

  // 그 외는 날짜 표시
  return dateString.slice(0, 10)
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.common-board-item {
  min-height: 80px;
  border: 1px solid #DDDDDD;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.two-line {
    min-height: 114px;
  }

  .board-name {
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 1.2;
    color: #006BE5;
    margin: 0 0 2px 0;
  }

  h3.title {
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.2;
    color: #333333;
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .preview {
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 350;
    font-size: 14px;
    line-height: 1.2;
    color: #686868;
    margin: 0 0 auto 0;

    // 기본 1줄
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    // 2줄인 경우
    &.two-line {
      white-space: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
      line-height: 1.2;
      max-height: 33.6px; // 17px * 2줄
    }
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: #999999;
    margin-top: auto;
    margin-top: 8px;

    .likes {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #999999;

      .bi {
        color: #ED2040;
      }

      em {
        color: #ED2040;
        font-style: normal;
        font-weight: 400;
      }
    }

    .comments {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #999999;

      .bi {
        color: #2196F3;
      }

      em {
        color: #2196F3;
        font-style: normal;
        font-weight: 400;
        opacity: 0.9;
      }
    }

    .datetime {
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 350;
      font-size: 12px;
      color: #999999;
    }

    .writer {
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 350;
      font-size: 12px;
      color: #999999;
    }
  }
}

// 호버 효과
.common-board-item:hover {
  background-color: #f8f9fa;
  border-color: #006BE5;
}
</style>
