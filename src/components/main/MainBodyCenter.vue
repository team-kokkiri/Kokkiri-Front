<template>
  <div class="mainbody-center">
    <div class="mainbody-center-inner">
      <!-- 메인 공지사항 배너 -->
      <div class="main-notice-banner">
        <div class="banner-content">
          <img src="@/assets/img/광고배너.png" alt="공지사항 배너" />
        </div>
      </div>

      <!-- 프로젝트 소개 슬라이드 -->
      <template v-if="hasProjectPosts">
        <ProjectSlider :projects="projectPosts" />
      </template>
      <div v-else class="no-project-message">
        등록된 프로젝트 소개 글이 없습니다.
      </div>

      <!-- 메인 게시판 목록 -->
      <div class="main-board-list">
        <BoardList
            v-for="board in boardList"
            :key="board.id"
            :board-title="board.title"
            :board-items="board.items"
            :board-type-id="board.id"
            @board-item-click="(itemId) => $emit('board-item-click', { boardId: board.id, itemId })"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref, onMounted } from 'vue'
import axios from 'axios'
import ProjectSlider from './ProjectSlider.vue'
import BoardList from './BoardList.vue'

defineEmits(['board-item-click'])

const boardList = ref([])
const hasProjectPosts = ref(true)
const projectPosts = ref([])
const token = localStorage.getItem('accessToken');
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

const fetchMainBoardData = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/boards/main`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = res.data;
    console.log(data)

    boardList.value = [
      {
        id: 1,
        title: '공지사항',
        items: data.notice.slice(0, 5).map(item => ({
          id: item.id,
          text: item.boardTitle,
          meta: item.createdAt?.slice(0, 10) || ''
        }))
      },
      {
        id: 2,
        title: '자유게시판',
        items: data.free.slice(0, 5).map(item => ({
          id: item.id,
          text: item.boardTitle,
          meta: item.createdAt?.slice(0, 10) || ''
        }))
      },
      {
        id: 3,
        title: 'BEST 게시판',
        items: data.best.slice(0, 5).map(item => ({
          id: item.id,
          text: item.boardTitle,
          meta: item.createdAt?.slice(0, 10) || ''
        }))
      }
    ];

    projectPosts.value = (data.project || []).map(item => ({
      id: item.id,
      title: item.boardTitle,
      description: item.boardContent,
      thumbnail: `${API_BASE_URL}${item.thumbnailUrl}`
    }))
    hasProjectPosts.value = projectPosts.value.length > 0;

  } catch (err) {
    console.error('메인 게시판 데이터 불러오기 실패:', err);
  }
};


onMounted(fetchMainBoardData)

</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.mainbody-center {
  width: 653px;

  .mainbody-center-inner {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .main-notice-banner {
      .banner-content {
        width: 100%;
        height: 160px;
        background: #F9F9F9;
        border-radius: 8px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .main-board-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  }
}

.no-project-message {
  width: 100%;
  padding: 20px;
  text-align: center;
  color: #888;
  background: #f5f5f5;
  border-radius: 5px;
}

</style>