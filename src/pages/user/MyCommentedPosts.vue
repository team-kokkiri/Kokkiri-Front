<template>
  <BoardPageLayout
      title="댓글 단 글"
      description="내가 댓글을 작성한 모든 게시물을 확인할 수 있습니다."
      :items="myCommentedList"
      :currentPage="currentPage"
      :hasNext="hasNextPage"
      :showPagination="false"
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

import BoardPageLayout from '@/components/common/layout/BoardPageLayout.vue'
import CommonBoardList from '@/components/common/layout/CommonBoardList.vue'

const router = useRouter()

const myCommentedList = ref([])
const currentPage = ref(1)
const isLastPage = ref(false)
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'

const boardConfig = {
  showBoardType: false,
  showPreview: false,
  emptyMessage: '댓글을 작성한 게시물이 없습니다.',
  emptyDescription: '댓글을 작성하면 여기에 표시됩니다.'
}

const boardTypeMap = {
  '자유게시판': 1,
  '자료공유 게시판': 2,
  '공지사항': 4,
  '프로젝트 소개': 5
}

const fetchMyCommentedList = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/boards/my/commented`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: currentPage.value - 1,
        size: 20
      }
    })
    const data = res.data
    myCommentedList.value = data.boardListResDtos.map(item => ({
      ...item,
      boardId: boardTypeMap[item.boardType?.trim()] || 1, // 기본값 1(자유게시판)
      id: item.id
    }))
  } catch (err) {
    console.error('댓글 단 글 목록 가져오기 실패:', err)
  }
}

onMounted(fetchMyCommentedList)

const hasNextPage = computed(() => !isLastPage.value)

// 게시글 상세로 이동
function goToDetail({ boardId, id }) {
  if (boardId === 1) {
    router.push(`/main-page/free-board/${id}`)
  } else if (boardId === 2) {
    router.push(`/main-page/share-board/${id}`)
  } else if (boardId === 4) {
    router.push(`/main-page/notice/${id}`)
  } else if (boardId === 5) {
    router.push(`/main-page/project-board/${id}`)
  } else {
    router.push(`/main-page/free-board/${id}`)
  }
}

function goFirst() {
  currentPage.value = 1
  fetchMyCommentedList()
}

function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchMyCommentedList()
  }
}

function goNext() {
  if (!isLastPage.value) {
    currentPage.value++
    fetchMyCommentedList()
  }
}
</script>


<style lang="scss" scoped>
// 모든 스타일이 BoardPageLayout으로 이동했으므로 빈 상태
</style>
