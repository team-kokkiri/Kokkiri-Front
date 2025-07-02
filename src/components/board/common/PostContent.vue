<script setup>
import { defineProps, computed } from 'vue'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

const props = defineProps({
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

// 이미지와 파일을 분리
const imageUrls = computed(() =>
    (props.post.fileUrls || []).filter(isImage)
)
const fileUrls = computed(() =>
    (props.post.fileUrls || []).filter(url => !isImage(url))
)

const formattedContent = computed(() =>
  props.post.boardContent
    ? props.post.boardContent.replace(/\n/g, '<br>')
    : ''
)
</script>

<template>
  <div class="post-title-area">
    <h3 class="title">{{ post.title || post.boardTitle }}</h3>

    <!-- 이미지 슬라이드 -->
    <div v-if="imageUrls.length" class="file-list">
      <VueperSlides
          class="no-shadow"
          :arrows="true"
          :bullets="true"
          fixed-height="350px"
          style="max-width: 800px; height: 500px; margin: 0 auto;"
      >
        <VueperSlide
            v-for="(url, idx) in imageUrls"
            :key="idx"
        >
          <template #content>
            <img
                :src="resolveImageUrl(url)"
                alt=""
                class="slide-img-custom"
            />
          </template>
        </VueperSlide>
      </VueperSlides>
    </div>

    <!-- 이미지가 아닌 파일 링크 -->
    <div v-if="fileUrls.length" class="file-list">
      <div v-for="(url, idx) in fileUrls" :key="idx" class="file-item">
        <a :href="resolveImageUrl(url)" target="_blank" rel="noopener" class="file-link">
          첨부파일 {{ idx + 1 }}
        </a>
      </div>
    </div>

    <!-- 본문 내용 -->
    <div v-if="post.boardContent" class="content" v-html="formattedContent"></div>
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
        width: 100%;
        height: 100%;
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
    white-space: normal; /* remove any pre-line since we now use <br> */
  }
}
// Vueper Slides 슬라이더 내부까지 강제로 적용
::v-deep .vueperslides__arrow {
  color: #fff !important;
  background: none;
  border: none;
  font-size: 12px;
}
::v-deep .vueperslides__arrow--disabled {
  opacity: 0.3;
}
::v-deep .vueperslides__bullet .default {
  background-color: transparent !important;
  border: 2px solid #fff !important;
}
::v-deep .vueperslides__bullet--active .default {
  background-color: #fff !important;
  border: 2px solid #fff !important;
}

::v-deep .slide-img-custom {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000; /* 원하는 배경색 */
  border-radius: 5px;
  display: block;
  margin: 0 auto;
}

</style>