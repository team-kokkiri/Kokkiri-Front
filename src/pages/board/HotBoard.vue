<template>
  <BoardPageLayout
      title="HOT 게시판"
      description="공감 10개를 받으면 HOT 게시물로 자동 선정됩니다."
      :items="hotBoardList"
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
import { useRouter } from 'vue-router'
import axios from 'axios'

// 컴포넌트 import
import BoardPageLayout from '@/components/common/layout/BoardPageLayout.vue'
import CommonBoardList from '@/components/common/layout/CommonBoardList.vue'

// 라우터 인스턴스 생성
const router = useRouter()

// 상태 변수들
const hotBoardList = ref([])            // HOT 게시글 목록
const currentPage = ref(1)              // 현재 페이지
const totalPages = ref(1)               // 전체 페이지 수
const totalElements = ref(0)            // 전체 게시글 수
const isLastPage = ref(false)           // 마지막 페이지 여부
// const searchQuery = ref('')             // 검색어 상태
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// 게시판 설정
const boardConfig = {
  showBoardType: true,  // 게시판명 표시
  showPreview: true,    // 내용 미리보기 표시
  emptyMessage: 'HOT 게시물이 없습니다.',
  emptyDescription: '좋아요 10개 이상을 받은 게시물이 여기에 표시됩니다.'
}

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
        size: 20,                     // HOT 게시판은 더 많이 보여줌
      }
    })
    const data = res.data
    
    //  hotBoardList.value = data;
    hotBoardList.value = Array.isArray(data.boardListResDtos) ? data.boardListResDtos : []
    currentPage.value = data.currentPage + 1  // 0부터 시작하는 걸 프론트는 1부터 보여주기 위함
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
    isLastPage.value = data.isLast
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
function goToDetail({ id, route, boardId }) {
  const targetId = id || boardId
  const targetRoute = route || 'free-board' // 기본값 설정
  router.push(`/main-page/${targetRoute}/${targetId}`)
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
// 모든 스타일이 BoardPageLayout으로 이동했으므로 빈 상태
</style>
