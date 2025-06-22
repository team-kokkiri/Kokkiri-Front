<script setup>
import { defineProps } from 'vue'

defineProps({
  post: {
    type: Object,
    required: true
  }
})

// 이미지 파일 판별 함수
function isImage(url) {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url)
}
</script>

<template>
  <div class="post-title-area">
    <h3 class="title">{{ post.title || post.boardTitle }}</h3>

    <!-- 첨부파일 -->
    <div v-if="post.fileUrls && post.fileUrls.length" class="file-list">
      <div v-for="(url, idx) in post.fileUrls" :key="idx" class="file-item">
        <img v-if="isImage(url)" :src="url" alt="첨부파일" class="file-image" />
        <a v-else :href="url" target="_blank" rel="noopener" class="file-link">
          첨부파일 {{ idx + 1 }}
        </a>
      </div>
    </div>

    <!-- 본문 내용 -->
    <p v-for="(line, idx) in post.boardContent.split('\n')" :key="idx" class="content">
      {{ line }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.post-title-area {
  .title {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 22px;
    font-weight: 500;
    color: #333333;
    line-height: 1.2;
    margin: 15px 0;
  }

  .file-list {
    margin-bottom: 15px;

    .file-item {
      margin-bottom: 10px;

      .file-image {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
      }

      .file-link {
        color: #2196f3;
        text-decoration: none;
        font-size: 14px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .content {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #686868;
    line-height: 1.2;
    margin: 0 0 8px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>