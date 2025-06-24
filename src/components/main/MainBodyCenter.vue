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
      <ProjectSlider />

      <!-- 메인 게시판 목록 -->
      <div class="main-board-list">
        <BoardList
            v-for="board in boardList"
            :key="board.id"
            :board-title="board.title"
            :board-items="board.items"
            @board-item-click="(itemId) => $emit('board-item-click', { boardId: board.id, itemId })"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { ref } from 'vue'
import ProjectSlider from './ProjectSlider.vue'
import BoardList from './BoardList.vue'

defineEmits(['board-item-click'])

const boardList = ref([
  {
    id: 1,
    title: '공지사항',
    items: [
      { id: 1, text: '안녕하세요 한국SW산업협회입니다.', meta: '3분전' },
      { id: 2, text: '대선 및 현충일 수업 관련 공지입니다.', meta: '06/04 21:09' },
      { id: 3, text: '이스트소프트 KDT 온라인 교육 홈페이지 신청 안내', meta: '06/03 18:05' },
      { id: 4, text: '금일, 교육생 선발 면접이 진행되오니 7층 복도 및 휴게실에서 큰 소음을 자제해주시기 바랍니다.', meta: '06/01 15:35' }
    ]
  },
  {
    id: 2,
    title: '자유게시판',
    items: [
      { id: 1, text: '안녕하세요 한국SW산업협회입니다.', meta: '3분전' },
      { id: 2, text: '대선 및 현충일 수업 관련 공지입니다.', meta: '06/04 21:09' },
      { id: 3, text: '이스트소프트 KDT 온라인 교육 홈페이지 신청 안내', meta: '06/03 18:05' },
      { id: 4, text: '금일, 교육생 선발 면접이 진행되오니 7층 복도 및 휴게실에서 큰 소음을 자제해주시기 바랍니다.', meta: '06/01 15:35' }
    ]
  },
  {
    id: 3,
    title: 'BEST 게시판',
    items: [
      { id: 1, text: '안녕하세요 한국SW산업협회입니다.', meta: '3분전' },
      { id: 2, text: '대선 및 현충일 수업 관련 공지입니다.', meta: '06/04 21:09' },
      { id: 3, text: '이스트소프트 KDT 온라인 교육 홈페이지 신청 안내', meta: '06/03 18:05' },
      { id: 4, text: '금일, 교육생 선발 면접이 진행되오니 7층 복도 및 휴게실에서 큰 소음을 자제해주시기 바랍니다.', meta: '06/01 15:35' }
    ]
  }
])
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
</style>