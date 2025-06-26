<template>
  <div class="my-written-posts-content">
    <div class="my-written-posts-inner">
      <!-- 헤더 -->
      <div class="my-written-posts-header">
        <div class="header-title">
          <h1>내가 쓴 글</h1>
          <p class="description">내가 작성한 모든 게시물을 확인할 수 있습니다.</p>
        </div>
      </div>

      <!-- 내가 쓴 글 리스트 -->
      <MyWrittenBoardList
          :items="myWrittenList"
          @itemClick="goToDetail"
      />

      <!-- 하단 페이지네이션 -->
      <div class="my-written-posts-footer" v-if="myWrittenList.length > 0">
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
import MyWrittenBoardList from '@/components/user/MyWrittenBoardList.vue'
import ListPagination from '@/components/board/list/ListPagination.vue'

// 라우터 인스턴스 생성
const router = useRouter()

// 상태 변수들
const myWrittenList = ref([])           // 내가 쓴 글 목록
const currentPage = ref(1)              // 현재 페이지
const isLastPage = ref(false)           // 마지막 페이지 여부
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// API에서 내가 쓴 글 리스트 불러오기
const fetchMyWrittenList = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/myboards/written`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = res.data
    console.log('내가 쓴 글 API 응답:', data)

    myWrittenList.value = data;

  } catch (err) {
    console.error('내가 쓴 글 목록 가져오기 실패:', err)
  }
}

// 페이지 진입 시 내가 쓴 글 호출
onMounted(async () => {
  await fetchMyWrittenList()
})

// 다음 페이지 존재 여부
const hasNextPage = computed(() => !isLastPage.value)

// 게시글 상세로 이동하는 함수
function goToDetail({ boardId }) {
  // 게시판 종류에 따라 다른 라우트로 이동할 수 있도록 구현
  // 현재는 자유게시판으로 이동하도록 설정 (실제로는 게시판 종류를 구분해야 함)
  router.push(`/main-page/free-board/${boardId}`)
}

// 페이지 이동 (현재는 페이지네이션이 없으므로 빈 함수)
function goFirst() {
  currentPage.value = 1
  // fetchMyWrittenList()
}

function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
    // fetchMyWrittenList()
  }
}

function goNext() {
  if (!isLastPage.value) {
    currentPage.value++
    // fetchMyWrittenList()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.my-written-posts-content {
  display: flex;
  justify-content: flex-start;
  width: 1180px;
  margin: 0 auto; // 중앙 정렬

  .my-written-posts-inner {
    width: 832px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .my-written-posts-header {
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

    .my-written-posts-footer {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}

</style>
