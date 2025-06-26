<template>
  <div class="hot-board-content">
    <div class="hot-board-inner">
      <!-- 헤더 -->
      <div class="hot-board-header">
        <div class="header-title">
          <h1>HOT 게시판</h1>
          <p class="description">공감 10개를 받으면 HOT 게시물로 자동 선정됩니다.</p>
        </div>
      </div>

      <!-- HOT 게시글 리스트 -->
      <HotBoardList
          :items="hotBoardList"
          @itemClick="goToDetail"
      />

      <!-- 하단 페이지네이션 -->
      <div class="hot-board-footer" v-if="hotBoardList.length > 0">
        <ListPagination
            :currentPage="currentPage"
            :hasNext="hasNextPage"
            @first="goFirst"
            @prev="goPrev"
            @next="goNext"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 컴포넌트 import
import HotBoardList from '@/components/board/list/HotBoardList.vue'
import ListPagination from '@/components/board/list/ListPagination.vue'

// 라우터 인스턴스 생성
const router = useRouter()

// 상태 변수들
const hotBoardList = ref([])            // HOT 게시글 목록
const currentPage = ref(1)              // 현재 페이지 // 전체 게시글 수
const isLastPage = ref(false)           // 마지막 페이지 여부
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// API에서 HOT 게시글 리스트 불러오기
const fetchHotBoardList = async () => {
  try {
    // HOT 게시글은 모든 게시판에서 좋아요 10개 이상인 게시글을 가져옴
    const res = await axios.get(`${API_BASE_URL}/api/boards/list/3`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: currentPage.value - 1,  // Spring의 Pageable은 0부터 시작
        size: 15,                     // HOT 게시판은 더 많이 보여줌
      }
    })
    const data = res.data
    console.log('HOT 게시글 API 응답:', data)

    // API 응답에 따라 조정 (실제 API 구조에 맞게 수정 필요)

    hotBoardList.value = data;

  } catch (err) {
    console.error('HOT 게시글 목록 가져오기 실패:', err)
  }
}

// 페이지 진입 시 HOT 게시글 호출
onMounted(async () => {
  await fetchHotBoardList()
})

// 다음 페이지 존재 여부
const hasNextPage = computed(() => !isLastPage.value)

// 게시글 상세로 이동하는 함수 - 각 게시판의 상세 페이지로 이동
function goToDetail({ id, route }) {
  router.push(`/main-page/${route}/${id}`)
}

// 페이지 이동
function goFirst() {
  currentPage.value = 1
  fetchHotBoardList()
}

function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchHotBoardList()
  }
}

function goNext() {
  if (!isLastPage.value) {
    currentPage.value++
    fetchHotBoardList()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.hot-board-content {
  display: flex;
  justify-content: flex-start;
  width: 1180px;
  margin: 0 auto; // 중앙 정렬

  .hot-board-inner {
    width: 832px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .hot-board-header {
      border: 1px solid #DDDDDD;
      padding: 24px;
      margin-bottom: 5px;

      .header-title {
        h1 {
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: #333333;
          margin: 0 0 8px 0;
        }

        .description {
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          margin: 0;
        }
      }
    }

    .hot-board-footer {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}

@media (max-width: 768px) {
  .hot-board-content {
    width: 100%;
    padding: 0 20px;

    .hot-board-inner {
      width: 100%;

      .hot-board-footer {
        margin-top: 16px;
      }
    }
  }
}
</style>