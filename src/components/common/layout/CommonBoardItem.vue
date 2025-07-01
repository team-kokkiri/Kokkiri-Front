<template>
  <div class="common-board-item" :class="{ 'two-line': isTwoLine }" @click="handleClick">
    <div class="item-main">
      <div class="item-content">
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
      <div v-if="displayItem.thumbnailUrl" class="thumbnail">
        <img
            :src="resolveImageUrl(displayItem.thumbnailUrl)"
            alt="썸네일"
            class="thumbnail-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import 마스코트이미지 from '@/assets/img/마스코트.png'

// 게시판명 → boardId 매핑표
const boardTypeMap = {
  '자유게시판': 1,
  '자료공유 게시판': 2,
  '공지사항': 4,
  '프로젝트 소개': 5
}

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

// displayItem: 다양한 API 응답 형태를 통일된 형태로 변환
const displayItem = computed(() => {
  const item = props.item

  return {
    id: item.id || item.boardId,
    title: item.boardTitle || item.title,
    preview: item.boardContent || item.content || '',
    boardType: item.boardType || '',
    boardTypeId: item.boardTypeId ||
        boardTypeMap[item.boardType?.trim?.()] || // boardType으로 id 유추
        item.boardId,
    likeCount: item.likeCount || 0,
    commentCount: item.commentCount || 0,
    createdTime: item.createdTime || item.createdAt,
    writer: item.writer || item.writerName || '',
    thumbnailUrl: item.thumbnailUrl || '',
  }
})

// 내용 길이에 따라 2줄 표시 여부 결정
const isTwoLine = computed(() => {
  return props.config.showPreview && displayItem.value.preview && displayItem.value.preview.length > 50
})

// 클릭 핸들러 (boardId 올바르게 전달)
function handleClick() {
  const boardId =
      props.item.boardId ||
      boardTypeMap[props.item.boardType?.trim?.()] ||
      displayItem.value.boardTypeId ||
      null

  const itemData = {
    id: displayItem.value.id,
    boardId: boardId,
    boardType: displayItem.value.boardType
  }
  emit('click', itemData)
}

// 날짜 포맷팅
function formatDate(dateString) {
  if (!dateString) return ''
  const now = new Date()
  const date = new Date(dateString)
  const diff = now - date

  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}분 전`
  }
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}시간 전`
  }
  return dateString.slice(0, 10)
}

function resolveImageUrl(url) {
  if (!url) return 마스코트이미지
  const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'
  if (url.includes('\\') || url.includes('C:')) {
    const fileName = url.split('\\').pop() || url.split('/').pop()
    return `${baseUrl}/api/files/${fileName}`
  }
  return `${baseUrl}${url}`
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

.item-main {
  display: flex;
  gap: 15px;

  .item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .thumbnail {
    flex-shrink: 0;
    width: 60px;
    height: 60px;

    .thumbnail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }
  }
}
</style>
