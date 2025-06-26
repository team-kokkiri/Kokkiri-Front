<template>
  <BoardPageLayout
      title="자료공유 게시판"
      description="유용한 자료를 공유하고 다운로드할 수 있습니다."
      :items="shareBoardList"
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
const shareBoardList = ref([])          // 자료공유 게시글 목록
const currentPage = ref(1)              // 현재 페이지
const isLastPage = ref(false)           // 마지막 페이지 여부
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// 게시판 설정
const boardConfig = {
  showBoardType: false,  // 게시판명 숨기기
  showPreview: true,     // 내용 미리보기 표시
  emptyMessage: '공유된 자료가 없습니다.',
  emptyDescription: '자료를 공유하면 여기에 표시됩니다.'
}

// API에서 자료공유 게시글 리스트 불러오기
const fetchShareBoardList = async () => {
  try {
    // 자료공유 게시판 ID는 2로 가정 (실제 백엔드 설정에 따라 조정)
    const res = await axios.get(`${API_BASE_URL}/api/boards/list/2`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: currentPage.value - 1,
        size: 15
      }
    })
    const data = res.data
    console.log('자료공유 게시글 API 응답:', data)

    shareBoardList.value = data;

  } catch (err) {
    console.error('자료공유 게시글 목록 가져오기 실패:', err)
  }
}

// 페이지 진입 시 자료공유 게시글 호출
onMounted(async () => {
  await fetchShareBoardList()
})

// 다음 페이지 존재 여부
const hasNextPage = computed(() => !isLastPage.value)

// 게시글 상세로 이동하는 함수
function goToDetail({ id, boardId }) {
  const targetId = id || boardId
  router.push(`/main-page/share-board/${targetId}`)
}

// 페이지 이동
function goFirst() {
  currentPage.value = 1
  fetchShareBoardList()
}

function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchShareBoardList()
  }
}

function goNext() {
  if (!isLastPage.value) {
    currentPage.value++
    fetchShareBoardList()
  }
}
</script>

<style lang="scss" scoped>
// 모든 스타일이 BoardPageLayout으로 이동했으므로 빈 상태
</style>
