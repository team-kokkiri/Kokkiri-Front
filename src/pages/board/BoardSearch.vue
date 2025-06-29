<template>
  <BoardPageLayout
    :title="`'${searchQuery}' 검색 결과`"
    description="해당 키워드로 검색된 게시글 목록입니다."
    :items="boardList"
    :currentPage="currentPage"
    :hasNext="hasNextPage"
    @first="goFirst"
    @prev="goPrev"
    @next="goNext"
  >
    <template #board-list="{ items }">
      <CommonBoardList 
          :items="items" 
          :config="boardConfig"
          @itemClick="goToDetail" 
      />
    </template>
  </BoardPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'


// 컴포넌트 import
import BoardPageLayout from '@/components/common/layout/BoardPageLayout.vue'
import CommonBoardList from '@/components/common/layout/CommonBoardList.vue'

// 게시판 설정
const boardConfig = computed(() => ({
  showBoardType: true,
  showPreview: true,
  emptyMessage: `'${searchQuery.value}' 검색 결과가 없습니다.`,
  emptyDescription: '다른 키워드로 검색해보세요.'
}))

// 라우터 인스턴스 생성
const router = useRouter()
const route = useRoute()


// 상태 변수들
const boardList = ref([])               // 게시글 목록
const currentPage = ref(1)              // 현재 페이지
const totalPages = ref(1)               // 전체 페이지 수
const totalElements = ref(0)            // 전체 게시글 수
const isLastPage = ref(false)           // 마지막 페이지 여부
const searchQuery = computed(() => route.query.keyword || '')  // 검색어 상태
const token = localStorage.getItem('accessToken');
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// API에서 게시글 리스트 불러오기
const fetchBoardList = async () => {
  try {
    const params = {
      page: currentPage.value - 1,
      size: 20,
      keyword: searchQuery.value.trim()
    }

    const url = `${API_BASE_URL}/api/boards/search`

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    })

    const data = res.data

    boardList.value = Array.isArray(data.boardListResDtos) ? data.boardListResDtos : []
    currentPage.value = data.currentPage + 1
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
    isLastPage.value = data.isLast

    console.log('검색 결과 API 응답:', data)

  } catch (err) {
    console.error('게시글 목록 가져오기 실패:', err)
    boardList.value = []
  }
}

// 페이지 진입 시 게시글 호출
onMounted(async () => {
  await fetchBoardList()
})

// 다음 페이지 존재 여부
const hasNextPage = computed(() => !isLastPage.value)

// 게시글 상세로 이동하는 함수
function goToDetail(item) {
  if (!item.id) {
    console.warn('ID 없음:', item)
    return
  }
  router.push(`/main-page/free-board/${item.id}`)
}

// 페이지 이동
function goFirst() {
  currentPage.value = 1
  fetchBoardList()
}
function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchBoardList()
  }
}
function goNext() {
  if (!isLastPage.value) {
    currentPage.value++
    fetchBoardList()
  }
}

</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.board-search-content {
  display: flex;
  justify-content: flex-start;
  width: 1180px;
  margin: 0 auto; // 중앙 정렬

  .board-search-inner {
    width: 832px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .board-search-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}

@media (max-width: 768px) {
  .board-search-content {
    width: 100%;
    padding: 0 20px;

    .board-search-inner {
      width: 100%;

      .board-search-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
    }
  }
}
</style>
