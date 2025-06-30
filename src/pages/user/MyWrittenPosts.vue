<template>
  <BoardPageLayout
      title="내가 쓴 글"
      description="내가 작성한 모든 게시물을 확인할 수 있습니다."
      :items="myWrittenList"
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
const myWrittenList = ref([])           // 내가 쓴 글 목록
const currentPage = ref(1)              // 현재 페이지
// const totalPages = ref(1)               // 전체 페이지 수
// const totalElements = ref(0)            // 전체 게시글 수
const isLastPage = ref(false)           // 마지막 페이지 여부
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// 게시판 설정
const boardConfig = {
  showBoardType: true,
  showPreview: true,
  showThumbnail: true,
  emptyMessage: '작성한 게시물이 없습니다.',
  emptyDescription: '게시물을 작성하면 여기에 표시됩니다.'
}

// API에서 내가 쓴 글 리스트 불러오기
const fetchMyWrittenList = async () => {
  console.log('myWrittenList:', myWrittenList.value)
  try {
    const res = await axios.get(`${API_BASE_URL}/api/boards/my/written`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: currentPage.value - 1,  // Spring의 Pageable은 0부터 시작
        size: 20
      }
    })
    const data = res.data

    myWrittenList.value = data.boardListResDtos.map(item => {
      let boardId
      const boardTypeMap = {
        '자유게시판': 1,
        '공지사항': 4,
        '프로젝트 소개': 5
      }
      boardId = boardTypeMap[item.boardType?.trim()] || null

      return {
        id: item.id,
        boardId: boardId,
        boardTitle: item.boardTitle,
        boardContent: item.boardContent,
        thumbnailUrl: item.thumbnailUrl && !item.thumbnailUrl.startsWith('http')
          ? `${item.thumbnailUrl}`
          : item.thumbnailUrl || null,
        boardType: item.boardType,
        createdAt: item.createdAt,
        writer: item.writer
      }

    })

    console.log(data)
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
function goToDetail(item) {
  console.log('Clicked:', item.boardId, item.id)

  if (item.boardId === 1) {
    router.push(`/main-page/free-board/${item.id}`)
  } else if (item.boardId === 4) {
    router.push(`/main-page/notice-board/${item.id}`)
  } else if (item.boardId === 5) {
    router.push(`/main-page/project-board/${item.id}`)
  }
}

// 페이지 이동
function goFirst() {
  currentPage.value = 1
  fetchMyWrittenList()
}

function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchMyWrittenList()
  }
}

function goNext() {
  if (!isLastPage.value) {
    currentPage.value++
    fetchMyWrittenList()
  }
}
</script>

<style lang="scss" scoped>
// 모든 스타일이 BoardPageLayout으로 이동했으므로 빈 상태
</style>
