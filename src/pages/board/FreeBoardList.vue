<template>
  <div class="board-free-content">
    <div class="board-free-inner">
      <!-- 헤더 컴포넌트 -->
      <ListHeader 
        :question-posts="questionPosts" 
        @question-click="goToDetail"
      />

      <!-- 글쓰기 폼 컴포넌트 -->
      <ListWriteForm
          :boardTypeId="1"
          @submit="handleSubmitPost"
          @imageUpload="handleImageUpload"
      />

      <!-- 게시글 리스트 컴포넌트 -->
      <BoardList
        :items="boardList"
        @itemClick="goToDetail"
      />
      

      <!-- 하단 푸터 -->
      <div class="board-free-footer">
        <!-- 검색 컴포넌트 -->
        <ListSearch
            :visible="currentPage === 1"
            @search="handleSearch"
            @input="handleSearchInput"
        />

        <!-- 페이지네이션 컴포넌트 -->
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
import ListHeader from '@/components/board/list/ListHeader.vue'
import ListWriteForm from '@/components/board/list/ListWriteForm.vue'
import BoardList from '@/components/board/list/BoardList.vue'
import ListSearch from '@/components/board/list/ListSearch.vue'
import ListPagination from '@/components/board/list/ListPagination.vue'
// import FreeBoardItem from './FreeBoardItem.vue'

// 라우터 인스턴스 생성
const router = useRouter()

// 상태 변수들
const boardList = ref([])               // 게시글 목록
const currentPage = ref(1)              // 현재 페이지
const totalPages = ref(1)               // 전체 페이지 수
const totalElements = ref(0)            // 전체 게시글 수
const isLastPage = ref(false)           // 마지막 페이지 여부
const searchQuery = ref('')             // 검색어 상태
const token = localStorage.getItem('accessToken');
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// 질문글 필터링된 리스트
const questionPosts = computed(() => {
  return boardList.value.filter(post => post.questionYn === true)
})

// API에서 게시글 리스트 불러오기
const fetchBoardList = async () => {
  try {
    const params = {
      page: currentPage.value - 1,
      size: 20,
    }

    let url = `${API_BASE_URL}/api/boards/list/1`

    // 검색어가 있는 경우 검색 API로 변경
    if (searchQuery.value.trim()) {
      url = `${API_BASE_URL}/api/boards/search/1`
      params.keyword = searchQuery.value.trim()
    }

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

    console.log('자유게시판 API 응답:', data)

  } catch (err) {
    console.error('게시글 목록 가져오기 실패:', err)
    boardList.value = []
  }
}

// 페이지 진입 시 게시글 호출
onMounted(async () => {
  await fetchBoardList()
})

// 다음 페이지 존재 여부 (임시로 항상 true, 실제로는 API 응답에 따라)
const hasNextPage = computed(() => !isLastPage.value)

// 게시글 상세로 이동하는 함수
function goToDetail(id) {
  router.push(`/main-page/free-board/${id}`)
}

// 검색 필터링된 리스트 반환
// const filteredBoardList = () => {
//   if (!searchQuery.value.trim()) return boardList.value

//   const query = searchQuery.value.trim().toLowerCase()
//   return boardList.value.filter(item =>
//     item.boardTitle.toLowerCase().includes(query) ||
//     item.boardContent.toLowerCase().includes(query) ||
//     item.writer.toLowerCase().includes(query)
//   )
// }

// 글쓰기 폼 제출 핸들러
async function handleSubmitPost(formData) {
  try {
    const form = new FormData()
    form.append(
        'board',
        new Blob([JSON.stringify({
          boardTitle: formData.boardTitle,
          boardContent: formData.boardContent,
          questionYn: formData.questionYn,
          boardTypeId: 1
        })], { type: 'application/json' })
    )
    if (formData.attachedImages && formData.attachedImages.length > 0) {
      formData.attachedImages.forEach(file => {
        form.append('files', file)
      })
    }

    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    const res = await axios.post(`${API_BASE_URL}/api/boards`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('게시글 등록 성공:', res.data)
    // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    await fetchBoardList()
  } catch (err) {
    console.error('게시글 등록 실패:', err)
  }
}

// 이미지 업로드 핸들러
function handleImageUpload() {
  console.log('이미지 업로드 요청')
  // 실제로는 파일 업로드 로직
}

// 검색 핸들러
function handleSearch(query) {
  console.log('검색:', query)
  searchQuery.value = query
  currentPage.value = 1
  fetchBoardList() // 검색 API 호출 트리거
}

// 검색 입력 핸들러
function handleSearchInput() {
  // 실시간 검색이 필요한 경우 사용
  // console.log('검색 입력:', query)
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

.board-free-content {
  display: flex;
  justify-content: flex-start;
  width: 1180px;
  margin: 0 auto; // 중앙 정렬

  .board-free-inner {
    width: 832px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .board-free-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}

@media (max-width: 768px) {
  .board-free-content {
    width: 100%;
    padding: 0 20px;

    .board-free-inner {
      width: 100%;

      .board-free-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
    }
  }
}
</style>
