<template>
  <div class="board-free-item" @click="handleClick">
    <div class="item-main">
      <div class="item-content">
        <h3 class="title">{{ item.boardTitle }}</h3>
        <p class="preview">{{ item.boardContent }}</p>
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
      <div v-if="item.thumbnailUrl" class="thumbnail">
        <img
            :src="resolveImageUrl(item.thumbnailUrl)"
            alt="썸네일"
            class="thumbnail-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

function resolveImageUrl(url) {
  if (!url) return ''
  
  const baseUrl = process.env.VUE_APP_API_BASE_URL
  
  // thumbnailUrl의 로컬 경로에서 파일명만 추출
  if (url.includes('\\') || url.includes('C:')) {
    const fileName = url.split('\\').pop() || url.split('/').pop()
    return `${baseUrl}/api/files/${fileName}`
  }
  
  // 이미 API 경로 형태인 경우
  return `${baseUrl}${url}`
}

function handleClick() {
  emit('click', {
    itemId: props.item.id,
    boardTypeId: props.item.boardTypeId, // ← 게시판 ID가 포함되어 있어야 함
  })
}

function formatDate(dateString) {
  return dateString ? dateString.slice(0, 10) : ''
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';
.board-free-item {
  min-height: 92px;
  max-height: 114px;
  border: 1px solid $dim-gray;
  padding: 19px 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  h3.title {
    font-weight: bold;
    color: #292929;
    margin: 0 0 0 1px;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .preview {
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    margin: 0;
    max-height: 100px;
    line-height: 20px;
    white-space: normal;
    color: #444444;
    font-weight: normal;
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: #bdbdbd;
    margin: 0;

    .likes {
      margin-right: 8px;
      height: 18px;
      color: #a6a6a6;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;

      .bi {
        color: #F91F15;
        margin-right: 6px;
      }

      em {
        color: #F91F15;
        font-style: normal;
      }
    }

    .comments {
      margin-right: 8px;
      height: 18px;
      color: #a6a6a6;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;

      .bi {
        color: #05BCBC;
        margin-right: 6px;
      }

      em {
        color: #05BCBC;
        font-style: normal;
      }
    }

    .datetime {
      margin-right: 8px;
      color: #a6a6a6;
    }

    .writer {
      color: #a6a6a6;
    }
  }
  
  .item-main {
    display: flex;
    gap: 15px;
    
    .item-content {
      flex: 1;
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
}
</style>
