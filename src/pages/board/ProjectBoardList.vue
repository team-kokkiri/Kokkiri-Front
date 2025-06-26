<template>
  <BoardPageLayout
      title="프로젝트 소개"
      description="팀 프로젝트를 소개하고 공유해보세요."
      :items="projectBoardList"
      :currentPage="currentPage"
      :hasNext="hasNextPage"
      :showWriteForm="true"
      @first="goFirst"
      @prev="goPrev"
      @next="goNext"
  >
    <template #write-form>
      <ListWriteForm
          @submit="handleSubmitPost"
          @imageUpload="handleImageUpload"
      />
    </template>
    
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
import ListWriteForm from "@/components/board/list/ListWriteForm.vue";

// 라우터 인스턴스 생성
const router = useRouter()

// 상태 변수들
const projectBoardList = ref([])        // 프로젝트 소개 게시글 목록
const currentPage = ref(1)              // 현재 페이지
const isLastPage = ref(false)           // 마지막 페이지 여부
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// 게시판 설정
const boardConfig = {
  showBoardType: false,  // 게시판명 숨기기
  showPreview: true,     // 내용 미리보기 표시
  emptyMessage: '소개된 프로젝트가 없습니다.',
  emptyDescription: '프로젝트를 소개하면 여기에 표시됩니다.'
}

// API에서 프로젝트 소개 게시글 리스트 불러오기
const fetchProjectBoardList = async () => {
  try {
    // 프로젝트 소개 게시판 ID는 5로 가정 (실제 백엔드 설정에 따라 조정)
    const res = await axios.get(`${API_BASE_URL}/api/boards/list/5`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: currentPage.value - 1,
        size: 15
      }
    })
    const data = res.data
    console.log('프로젝트 소개 게시글 API 응답:', data)

    projectBoardList.value = data;

  } catch (err) {
    console.error('프로젝트 소개 게시글 목록 가져오기 실패:', err)
  }
}

// 페이지 진입 시 프로젝트 소개 게시글 호출
onMounted(async () => {
  await fetchProjectBoardList()
})

// 다음 페이지 존재 여부
const hasNextPage = computed(() => !isLastPage.value)

// 게시글 상세로 이동하는 함수
function goToDetail({ id, boardId }) {
  const targetId = id || boardId
  router.push(`/main-page/project-board/${targetId}`)
}

// 페이지 이동
function goFirst() {
  currentPage.value = 1
  fetchProjectBoardList()
}

function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProjectBoardList()
  }
}

function goNext() {
  if (!isLastPage.value) {
    currentPage.value++
    fetchProjectBoardList()
  }
}

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
          boardTypeId: 5 // 프로젝트 소개 게시판 ID
        })], { type: 'application/json' })
    )
    if (formData.attachedImages && formData.attachedImages.length > 0) {
      formData.attachedImages.forEach(file => {
        form.append('files', file)
      })
    }

    const res = await axios.post(`${API_BASE_URL}/api/boards`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('프로젝트 소개 등록 성공:', res.data)
    
    await fetchProjectBoardList()
  } catch (err) {
    console.error('프로젝트 소개 등록 실패:', err)
  }
}

// 이미지 업로드 핸들러
function handleImageUpload() {
  console.log('이미지 업로드 요청')
}
</script>

<style lang="scss" scoped>
// 모든 스타일이 BoardPageLayout으로 이동했으므로 빈 상태
</style>
