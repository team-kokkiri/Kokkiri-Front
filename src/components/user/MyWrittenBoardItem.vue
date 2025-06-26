<template>
  <div class="my-written-board-item" @click="handleClick">
    <!-- 제목 -->
    <h3 class="title">{{ item.boardTitle }}</h3>

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
      <span class="datetime">{{ formatDate(item.createdTime) }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['click'])

// 클릭 핸들러
function handleClick() {
  emit('click', { boardId: props.item.boardId })
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

.my-written-board-item {
  min-height: 80px;
  border: 1px solid #DDDDDD;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  h3.title {
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.2;
    color: #333333;
    margin: 0 0 auto 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: #999999;
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
  }
}

// 호버 효과
.my-written-board-item:hover {
  background-color: #f8f9fa;
  border-color: #006BE5;
}
</style>
