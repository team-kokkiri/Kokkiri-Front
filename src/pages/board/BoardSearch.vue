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
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

import BoardPageLayout from '@/components/common/layout/BoardPageLayout.vue'
import CommonBoardList from '@/components/common/layout/CommonBoardList.vue'

const router = useRouter()
const route = useRoute()

const boardList = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalElements = ref(0)
const isLastPage = ref(false)
const searchQuery = computed(() => route.query.keyword || '')
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'

const boardConfig = computed(() => ({
  showBoardType: true,
  showPreview: true,
  emptyMessage: `'${searchQuery.value}' 검색 결과가 없습니다.`,
  emptyDescription: '다른 키워드로 검색해보세요.'
}))

// ⭐ 핵심: 검색어(keyword)나 페이지(currentPage)가 바뀌면 검색
watch(
    [() => route.query.keyword, currentPage],
    async () => {
      // 검색어가 없으면 빈 배열 반환
      if (!searchQuery.value.trim()) {
        boardList.value = []
        totalPages.value = 1
        totalElements.value = 0
        isLastPage.value = true
        return
      }
      await fetchBoardList()
    },
    { immediate: true }
)

async function fetchBoardList() {
  try {
    const params = {
      page: currentPage.value - 1,
      size: 20,
      keyword: searchQuery.value.trim()
    }
    const url = `${API_BASE_URL}/api/boards/search`
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    const data = res.data
    boardList.value = Array.isArray(data.boardListResDtos) ? data.boardListResDtos : []
    currentPage.value = data.currentPage + 1
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
    isLastPage.value = data.isLast
    // console.log('검색 결과 API 응답:', data)
  } catch (err) {
    boardList.value = []
    console.error('게시글 목록 가져오기 실패:', err)
  }
}

const hasNextPage = computed(() => !isLastPage.value)

function goToDetail(item) {
  if (!item.id) {
    console.warn('ID 없음:', item)
    return
  }
  router.push(`/main-page/free-board/${item.id}`)
}
function goFirst() {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
}
function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
function goNext() {
  if (!isLastPage.value) {
    currentPage.value++
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
