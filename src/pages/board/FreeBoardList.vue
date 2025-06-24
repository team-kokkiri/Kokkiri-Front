<template>
  <div class="board-free-content">
    <div class="board-free-inner">
      <!-- 헤더 컴포넌트 -->
      <ListHeader />

      <!-- 글쓰기 폼 컴포넌트 -->
      <ListWriteForm
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
// vue 기능 import
import { ref, computed } from 'vue'
// vue-router에서 라우터 인스턴스 import
import { useRouter } from 'vue-router'

// 컴포넌트 import
import ListHeader from '@/components/board/list/ListHeader.vue'
import ListWriteForm from '@/components/board/list/ListWriteForm.vue'
import BoardList from '@/components/board/list/BoardList.vue'
import ListSearch from '@/components/board/list/ListSearch.vue'
import ListPagination from '@/components/board/list/ListPagination.vue'

// 게시글 리스트 샘플 데이터 import
import boardData from '@/data/boardList.json'

// 라우터 인스턴스 생성
const router = useRouter()

// 현재 페이지 번호 상태
const currentPage = ref(1)

// 검색어 상태
const searchQuery = ref('')

// 게시글 리스트(샘플 json 데이터)
const boardList = computed(() => {
  let filteredList = boardData.boardListResDtos
  
  // 검색어가 있으면 필터링
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filteredList = filteredList.filter(item => 
      item.boardTitle.toLowerCase().includes(query) ||
      item.boardContent.toLowerCase().includes(query) ||
      item.writer.toLowerCase().includes(query)
    )
  }
  
  return filteredList
})

// 다음 페이지 존재 여부 (임시로 항상 true, 실제로는 API 응답에 따라)
const hasNextPage = computed(() => true)

// 게시글 상세로 이동하는 함수
function goToDetail(id) {
  router.push(`/main-page/free-board/${id}`)
}

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
function goFirst() {
  currentPage.value = 1
}

function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function goNext() {
  currentPage.value++
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
