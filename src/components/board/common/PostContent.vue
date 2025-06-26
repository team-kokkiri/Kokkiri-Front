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

function resolveImageUrl(url) {
  const baseUrl = process.env.VUE_APP_API_BASE_URL
  return `${baseUrl}${url}`
}
</script>

<template>
  <div class="post-title-area">
    <h3 class="title">{{ post.title || post.boardTitle }}</h3>

    <!-- 첨부파일 -->
    <div v-if="post.fileUrls && post.fileUrls.length" class="file-list">
      <div v-for="(url, idx) in post.fileUrls" :key="idx" class="file-item">
        <img
          v-if="isImage(url)"
          :src="resolveImageUrl(url)"
          alt="첨부파일"
          class="file-image"
        />
        <a v-else :href="url" target="_blank" rel="noopener" class="file-link">
          첨부파일 {{ idx + 1 }}
        </a>
      </div>
    </div>

    <!-- 본문 내용 -->
    <div v-if="post.boardContent">
      <p v-for="(line, idx) in post.boardContent.split('\n')" :key="idx" class="content">
        {{ line }}
      </p>
    </div>
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
    overflow-x: auto;
    padding: 5px;

    .file-item {
      margin-bottom: 10px;

      .file-image {
        max-width: 100%;
        max-height: 400px; /* or 원하는 높이 값 */
        width: auto;
        height: auto;
        border-radius: 5px;
        object-fit: contain; /* 이미지 비율 유지하면서 박스에 맞게 조정 */
        display: block;
        margin: 10px auto; /* add vertical spacing */
        box-sizing: border-box;
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