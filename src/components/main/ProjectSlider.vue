<template>
  <div class="project-slider">
    <div class="project-slider-header">
      <h2 class="slider-title">프로젝트를 소개합니다!</h2>
    </div>

    <div class="slider-content">
      <div class="slider-wrapper">
        <div class="project-cards-container" :style="{ transform: `translateX(-${currentIndex * cardWidth}px)` }">
          <div
              v-for="project in projects"
              :key="project.id"
              class="project-card"
          >
            <div class="project-thumbnail">
              <div class="thumbnail-placeholder" :style="{ backgroundColor: project.color }"></div>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentIndex = ref(0)
const cardWidth = 303 // 카드 너비(291px) + 간격(12px)
const visibleCards = 2 // 동시에 보이는 카드 수

const projects = ref([
  {
    id: 1,
    title: '프로젝트 A',
    team: 'Team KOKKIRI',
    description: '이 프로젝트는 테스트 용으로\n만들었습니다\n많은관심 부탁드립니다\n테스트 테스트 테스트 테스트',
    color: '#E8F4FD'
  },
  {
    id: 2,
    title: '프로젝트 B',
    team: 'Team GPT',
    description: '이 프로젝트는 테스트 용으로\n만들었습니다\n많은관심 부탁드립니다\n테스트 테스트 테스트 테스트',
    color: '#FFF2E8'
  },
  {
    id: 3,
    title: '프로젝트 C',
    team: 'Team CLAUDE',
    description: '이 프로젝트는 테스트 용으로\n만들었습니다\n많은관심 부탁드립니다\n테스트 테스트 테스트 테스트',
    color: '#F0F8E8'
  },
  {
    id: 4,
    title: '프로젝트 D',
    team: 'Team REACT',
    description: '이 프로젝트는 테스트 용으로\n만들었습니다\n많은관심 부탁드립니다\n테스트 테스트 테스트 테스트',
    color: '#F8E8F0'
  }
])

const maxIndex = computed(() => {
  return Math.max(0, projects.value.length - visibleCards)
})

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
      top: 40px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .project-cards-container {
      display: flex;
      gap: 0;
      transition: transform 0.3s ease;
      height: 100%;
      padding: 3px 31px;
    }

    .project-card {
      flex: 0 0 291px;
      background: white;
      border: 1px solid #DDDDDD;
      border-radius: 15px;
      padding: 0;
      display: flex;
      align-items: center;
      gap: 7px;
      height: 138px;
      margin-right: 12px;

      .project-thumbnail {
        flex: 0 0 133px;
        height: 138px;

        .thumbnail-placeholder {
          width: 100%;
          height: 100%;
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
          margin: 0;
          white-space: pre-line;
          flex: 1;
        }
      }
    }

    .slider-controls {
      position: absolute;
      bottom: 3px;
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
        transform: rotate(180deg);
      }

      .next-btn {
        // 기본 상태
      }
    }
  }
}
</style>