<template>
  <div class="hot-board-item" :class="{ 'two-line': isTwoLine }" @click="handleClick">
    <!-- 게시판명 -->
    <span class="board-name">{{ getBoardName(item.boardTypeId) }}</span>

    <!-- 제목 -->
    <h3 class="title">{{ item.boardTitle }}</h3>

    <!-- 내용 미리보기 -->
    <p class="preview" :class="{ 'two-line': isTwoLine }">{{ item.boardContent }}</p>

    <!-- 하단 정보 -->
    <div class="item-info">
      <span class="likes" v-if="item.likeCount > 0">
        <i class="bi bi-hand-thumbs-up"></i>
        <em>{{ item.likeCount }}</em>
      </span>
      <span class="comments" v-if="item.commentCount > 0">
        <i class="bi bi-chat"></i>
        <em>{{ item.commentCount }}</em>
      </span>
      <span class="datetime">{{ formatDate(item.createdAt) }}</span>
      <span class="writer">{{ item.writer }}</span>
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
  }
})

// Emits
const emit = defineEmits(['click'])

// 게시판명 매핑
const getBoardName = (boardTypeId) => {
  const boardNames = {
    1: '자유게시판',
    2: '자료공유 게시판',
    3: '질문게시판',
    // 필요에 따라 추가
  }
  return boardNames[boardTypeId] || '게시판'
}

// 내용 길이에 따라 2줄 표시 여부 결정
const isTwoLine = computed(() => {
  return props.item.boardContent && props.item.boardContent.length > 50
})

// 클릭 핸들러 - 해당 게시판의 상세 페이지로 이동
function handleClick() {
  const boardRoutes = {
    1: 'free-board', // 자유게시판
    2: 'share-board', // 자료공유 게시판
    3: 'question-board', // 질문게시판 (예시)
  }

  const route = boardRoutes[props.item.boardTypeId] || 'free-board'
  emit('click', { id: props.item.id, route })
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

.hot-board-item {
  min-height: 114px;
  border: 1px solid #DDDDDD;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

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
    margin-top: 4px;

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

    .divider {
      width: 1px;
      height: 6px;
      background-color: #999999;
      margin: 0;
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
.hot-board-item:hover {
  background-color: #f8f9fa;
  border-color: #006BE5;
}
</style>