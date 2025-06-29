<template>
  <div class="project-slider">
    <div class="project-slider-header">
      <h2 class="slider-title">프로젝트를 소개합니다!</h2>
    </div>

    <div v-if="Array.isArray(projects) && projects.length > 0" class="slider-content">
      <div class="slider-wrapper">
        <div class="project-cards-container" :style="{ transform: `translateX(-${currentIndex * slideDistance}px)` }">
          <div
              v-for="project in projects"
              :key="project.id"
              class="project-card"
          >
            <div class="project-thumbnail">
              <img :src="project.thumbnail" alt="프로젝트 썸네일" />
            </div>
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-team">{{ project.team }}</p>
              <p class="project-description">{{ project.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="slider-controls">
        <button
            class="control-btn prev-btn"
            @click="prevSlide"
            :disabled="currentIndex === 0"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <button
            class="control-btn next-btn"
            @click="nextSlide"
            :disabled="currentIndex >= maxIndex"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
    <div v-else class="no-projects-message">
      등록된 프로젝트 소개 글이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
})
const currentIndex = ref(0)
const visibleCards = 2;
const cardGap = 12; // 카드 간격 (px)
const containerWidth = 600; // 전체 컨테이너 너비 (px)

// 정확한 카드 너비 계산
const cardWidth = (containerWidth - (cardGap * (visibleCards - 1))) / visibleCards;

// 슬라이드 거리
const slideDistance = cardWidth + cardGap;

const maxIndex = computed(() => {
  return Math.max(0, props.projects.length - visibleCards)
});

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.project-slider {
  background: white;
  border: 1px solid #DDDDDD;
  height: 186px;
  position: relative;

  .project-slider-header {
    position: absolute;
    top: 12px;
    left: 20px;
    z-index: 2;

    .slider-title {
      font-family: $primary-kr;
      font-weight: 700;
      font-size: 14px;
      color: $royalblue;
      margin: 0;
    }
  }

  .slider-content {
    position: relative;
    height: 100%;

    .slider-wrapper {
      position: absolute;
      width: 602px;
      top: 40px;
      left: 28px;
      height: 143px;
      overflow: hidden;
    }

    .project-cards-container {
      display: flex;
      gap: 12px;
      transition: transform 0.3s ease;
      height: 100%;
      padding: 2px;
    }

    .project-card {
      flex: 0 0 294px;
      margin: 0;
      background: white;
      border: 1px solid #DDDDDD;
      border-radius: 15px;
      padding: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      height: 138px;

      .project-thumbnail {
        flex: 0 0 133px;
        height: 138px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 95%;
          height: 95%;
          border-radius: 15px;
          border: 2px solid white;
        }
      }

      .project-info {
        flex: 1;
        padding: 10px 10px 10px 0;
        height: 100%;
        display: flex;
        flex-direction: column;

        .project-title {
          font-family: $primary-kr;
          font-weight: 700;
          font-size: 14px;
          color: black;
          margin: 0 0 8px 0;
        }

        .project-team {
          font-family: $primary-kr;
          font-weight: 500;
          font-size: 12px;
          color: black;
          margin: 0 0 10px 0;
        }

        .project-description {
          font-family: $primary-kr;
          font-weight: 400;
          font-size: 12px;
          color: black;
          line-height: 1.2;
          margin: 0 0 5px;
          white-space: pre-line;
          flex: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
      }
    }

    .slider-controls {
      position: absolute;
      top: 60%;
      transform: translateY(-50%);
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
      height: 20px;

      .control-btn {
        pointer-events: all;
        width: 20px;
        height: 20px;
        border: none;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          opacity: 0.7;
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        i {
          font-size: 16px;
          color: black;
        }
      }

      .prev-btn {
        left: 5px;
      }

      .next-btn {
        right: 5px;
      }
    }
  }
}
</style>