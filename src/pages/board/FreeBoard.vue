<template>
  <div class="board-free-content">
    <div class="board-free-inner">
      <!-- 헤더 컴포넌트 -->
      <FreeBoardHeader />

      <!-- 글쓰기 폼 컴포넌트 -->
      <FreeBoardWriteForm 
          @submit="handleSubmitPost"
          @imageUpload="handleImageUpload"
      />

      <!-- 게시글 리스트 컴포넌트 -->
      <FreeBoardList 
          :items="boardList"
          @itemClick="goToDetail"
      />

      <!-- 하단 푸터 -->
      <div class="board-free-footer">
        <!-- 검색 컴포넌트 -->
        <FreeBoardSearch 
            :visible="currentPage === 1"
            @search="handleSearch"
            @input="handleSearchInput"
        />
        
        <!-- 페이지네이션 컴포넌트 -->
        <FreeBoardPagination 
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
import FreeBoardHeader from '@/components/board/freeboard/FreeBoardHeader.vue'
import FreeBoardWriteForm from '@/components/board/freeboard/FreeBoardWriteForm.vue'
import FreeBoardList from '@/components/board/freeboard/FreeBoardList.vue'
import FreeBoardSearch from '@/components/board/freeboard/FreeBoardSearch.vue'
import FreeBoardPagination from '@/components/board/freeboard/FreeBoardPagination.vue'

// 라우터 인스턴스 생성
const router = useRouter()

// 상태 변수들
const boardList = ref([])               // 게시글 목록
const currentPage = ref(1)              // 현재 페이지
const totalPages = ref(1)               // 전체 페이지 수
const totalElements = ref(0)            // 전체 게시글 수
const isLastPage = ref(false)           // 마지막 페이지 여부
const searchQuery = ref('')             // 검색어 상태


// 게시글 리스트(샘플 json 데이터)
// const boardList = computed(() => {
//   let filteredList = boardData.boardListResDtos
  
//   // 검색어가 있으면 필터링
//   if (searchQuery.value.trim()) {
//     const query = searchQuery.value.toLowerCase().trim()
//     filteredList = filteredList.filter(item => 
//       item.boardTitle.toLowerCase().includes(query) ||
//       item.boardContent.toLowerCase().includes(query) ||
//       item.writer.toLowerCase().includes(query)
//     )
//   }
  
//   return filteredList
// })


// API에서 게시글 리스트 불러오기
const fetchBoardList = async () => {
  try {
    const res = await axios.get(`http://localhost:9090/api/boards/list/1`, {
      params: {
        page: currentPage.value - 1,  // Spring의 Pageable은 0부터 시작
        size: 10
      }
    })

    console.log('✅ 응답 데이터:', res.data)

    const data = res.data
    boardList.value = data.boardListResDtos
    currentPage.value = data.currentPage + 1  // 0부터 시작하는 걸 프론트는 1부터 보여주기 위함
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
    isLastPage.value = data.last
  } catch (err) {
    console.error('게시글 목록 가져오기 실패:', err)
    boardList.value = []
  }
}

// 페이지 진입 시 게시글 호출
// onMounted(() => { fetchBoardList() })
onMounted(fetchBoardList)

// 다음 페이지 존재 여부 (임시로 항상 true, 실제로는 API 응답에 따라)
const hasNextPage = computed(() => true)

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
function handleSubmitPost(formData) {
  console.log('새 게시글 작성:', formData)
  // 실제로는 API 호출하여 게시글 등록
  // 성공시 목록 새로고침
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
  currentPage.value = 1 // 검색시 첫 페이지로
}

// 검색 입력 핸들러
function handleSearchInput() {
  // 실시간 검색이 필요한 경우 사용
  // console.log('검색 입력:', query)
}

// 페이지 이동 함수들
// function goFirst() {
//   currentPage.value = 1
// }

// function goPrev() {
//   if (currentPage.value > 1) {
//     currentPage.value--
//   }
// }

// function goNext() {
//   currentPage.value++
// }

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
