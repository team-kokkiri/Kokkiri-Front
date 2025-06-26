<template>
  <div class="admin-posts">
    <!-- 헤더 -->
    <div class="posts-header">
      <div class="header-title">
        <h2>게시판관리</h2>
      </div>
      <div class="header-line"></div>
    </div>

    <!-- HOT 게시판 섹션 -->
    <div class="hot-board-section">
      <div class="hot-board-header">
        <span class="hot-board-title">HOT 게시판</span>
        <button class="manage-btn" @click="handleHotBoardManage">
          관리
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

// ===== Props =====
const props = defineProps({
  postsData: {
    type: Array,
    default: () => []
  }
})

// ===== Emits =====
defineEmits(['refresh'])

// Mock 데이터 (API 연동 전 테스트용)
const mockPosts = [
  { 
    id: 1, 
    title: '오늘 점심 뭐 먹을까요?', 
    author: '고라니', 
    createdAt: '2025-06-26 14:30',
    views: 125,
    likes: 15,
    category: 'free'
  },
  { 
    id: 2, 
    title: 'Vue.js 질문있습니다', 
    author: '개발자1', 
    createdAt: '2025-06-26 13:15',
    views: 89,
    likes: 12,
    category: 'tech'
  },
  { 
    id: 3, 
    title: '주말 모임 공지', 
    author: '관리자', 
    createdAt: '2025-06-26 12:00',
    views: 203,
    likes: 45,
    category: 'notice'
  },
  { 
    id: 4, 
    title: 'React vs Vue 비교', 
    author: '프론트개발자', 
    createdAt: '2025-06-26 11:30',
    views: 167,
    likes: 23,
    category: 'tech'
  },
  { 
    id: 5, 
    title: '카페 추천해주세요', 
    author: '커피러버', 
    createdAt: '2025-06-26 10:45',
    views: 78,
    likes: 8,
    category: 'free'
  }
]

// ===== Computed =====
computed(() => {
  // props.postsData가 비어있으면 mock 데이터 사용
  return props.postsData.length > 0 ? props.postsData : mockPosts
})

// ===== 이벤트 핸들러 =====
function handleHotBoardManage() {
  // TODO: HOT 게시판 관리 로직 구현
  console.log('HOT 게시판 관리')
}

</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.admin-posts {
  width: 100%;
  height: 100%;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0 0;
  background: $white;
  display: flex;
  flex-direction: column;
}

.posts-header {
  .header-title {
    height: 72px;
    padding-left: 15px;
    padding-top: 28px;
    border-bottom: 1px solid $dim-gray;
    h2 {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
      margin: 0;
    }
  }
}

.hot-board-section {
  padding: 20px;
  border-bottom: 1px solid $dim-gray;
  flex-shrink: 0;
  height: 76px;

  .hot-board-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    .hot-board-title {
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
    }

    .manage-btn {
      width: 65px;
      height: 36px;
      background: $main-color;
      border: none;
      border-radius: 15px;
      font-family: $primary-kr;
      font-weight: 700;
      font-size: 16px;
      line-height: 1.2;
      color: $white;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: darken($main-color, 10%);
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }
}

.posts-list {
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 6px;
  }
  
  .posts-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .no-data {
    text-align: center;
    padding: 40px 20px;
    color: $silver-black;
  }
}
</style>
