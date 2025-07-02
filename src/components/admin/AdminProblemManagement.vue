<template>
  <div class="admin-problem-management">
    <!-- 헤더 -->
    <div class="admin-problem-header">
      <div class="title-section">
        <h2 class="management-title">일일문제관리</h2>
      </div>
      <div class="refresh-section">
        <button @click="handleRefresh" class="refresh-btn" :disabled="isLoading">
          <i class="bi bi-arrow-clockwise" :class="{ 'spin': isLoading }"></i>
        </button>
      </div>
    </div>

    <!-- 액션 버튼 -->
    <div class="action-buttons">
      <button 
        :class="['action-btn', 'list-btn', { active: currentView === 'list' }]"
        @click="setView('list')"
      >
        문제 리스트
      </button>
      <button 
        :class="['action-btn', 'create-btn', { active: currentView === 'create' }]"
        @click="setView('create')"
      >
        문제 생성
      </button>
    </div>

    <!-- 컨텐츠 영역 -->
    <div class="content-area">
      <!-- 문제 리스트 뷰 -->
      <div v-if="currentView === 'list'" class="problem-list-view">
        <div class="date-items-container">
          <div 
            v-for="dateGroup in problemDateGroups" 
            :key="dateGroup.date"
            class="date-item"
          >
            <div class="date-display">{{ dateGroup.date }}</div>
            <div class="action-buttons-group">
              <button 
                @click="viewProblemDetail(dateGroup.date)"
                class="view-edit-btn"
                :disabled="isLoading"
              >
                조회/수정
              </button>
              <button 
                @click="deleteProblem(dateGroup)"
                class="delete-btn"
                :disabled="isLoading"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
        
        <!-- 빈 상태 -->
        <div v-if="problemDateGroups.length === 0 && !isLoading" class="empty-state">
          <p>등록된 문제가 없습니다.</p>
        </div>
      </div>

      <!-- 문제 생성/수정 뷰 -->
      <div v-else-if="currentView === 'create' || currentView === 'edit'" class="problem-form-view">
        <!-- 문제 폼 -->
        <ProblemForm
          :mode="currentView"
          :problem-data="selectedProblem"
          :is-loading="isFormLoading"
          @save="handleSaveProblem"
          @back="goBackToList"
        />
      </div>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <i class="bi bi-arrow-clockwise spin"></i>
        <p>데이터를 불러오는 중...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'
import ProblemForm from './ProblemForm.vue'
import axios from 'axios'

// ===== Props & Emits =====
defineProps({
  activeMenu: {
    type: String,
    default: 'problems'
  }
})

const emit = defineEmits(['refresh'])

// ===== 상태 관리 =====
const currentView = ref('list') // 'list', 'create', 'edit'
const isLoading = ref(false)
const isFormLoading = ref(false)
const selectedDate = ref('')
const selectedProblem = ref(null)

// ===== API 설정 =====
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'
const token = localStorage.getItem('accessToken')

// ===== 데이터 상태 =====
const problemDateGroups = ref([])

// ===== Computed =====
const apiConfig = computed(() => ({
  headers: {
    'Authorization': `Bearer ${token}`
  }
}))

// ===== 에러 핸들링 =====
function handleError(error, context = '') {
  console.error(`${context} 오류:`, error)
  
  let errorMessage = '알 수 없는 오류가 발생했습니다.'
  
  if (error.response?.status === 401) {
    errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.'
    localStorage.removeItem('accessToken')
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  } else if (error.response?.status === 403) {
    errorMessage = '관리자 권한이 필요합니다.'
  } else if (error.response?.status === 404) {
    errorMessage = '요청한 리소스를 찾을 수 없습니다.'
  } else if (error.response?.status === 409) {
    errorMessage = '이미 존재하는 데이터입니다.'
  } else if (error.response?.status >= 500) {
    errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  } else if (error.response?.data?.status_message) {
    errorMessage = error.response.data.status_message
  } else if (error.message) {
    errorMessage = error.message
  }
  
  alert(errorMessage)
}

// ===== API 호출 함수들 =====
async function loadProblemList() {
  try {
    isLoading.value = true
    
    const response = await axios.get(`${API_BASE_URL}/api/problems/list?page=0&size=100&sortBy=problemDate&sortDir=DESC`, apiConfig.value)
    
    if (response.data && response.data.status_code === 200 && response.data.result && response.data.result.problems) {
      // API 응답에서 날짜별로 그룹화
      const problems = response.data.result.problems
      const dateGroups = problems.map(problem => ({
        date: problem.problemDate,
        problemId: problem.id,
        hasProblems: true,
        title: problem.title
      }))
      
      problemDateGroups.value = dateGroups
    } else {
      console.warn('예상치 못한 API 응답 구조:', response.data)
      problemDateGroups.value = []
    }
    
  } catch (error) {
    handleError(error, '문제 목록 로딩')
    problemDateGroups.value = []
  } finally {
    isLoading.value = false
  }
}

async function loadProblemByDate(date) {
  try {
    isFormLoading.value = true
    
    const response = await axios.get(`${API_BASE_URL}/api/problems/date/${date}`, apiConfig.value)
    
    if (response.data && response.data.status_code === 200 && response.data.result) {
      return response.data.result
    } else {
      console.warn('예상치 못한 API 응답 구조:', response.data)
      throw new Error('문제를 찾을 수 없습니다.')
    }
    
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('해당 날짜의 문제를 찾을 수 없습니다.')
    } else {
      handleError(error, '문제 상세 조회')
      throw error
    }
  } finally {
    isFormLoading.value = false
  }
}

async function createProblem(problemData) {
  try {
    isFormLoading.value = true
    
    const response = await axios.post(`${API_BASE_URL}/api/problems`, problemData, apiConfig.value)
    
    if (response.data && response.data.status_code === 201) {
      alert('문제가 성공적으로 생성되었습니다.')
      return response.data.result
    } else {
      throw new Error('문제 생성에 실패했습니다.')
    }
    
  } catch (error) {
    if (error.response?.status === 409) {
      handleError(new Error('해당 날짜에 이미 문제가 등록되어 있습니다.'), '문제 생성')
    } else {
      handleError(error, '문제 생성')
    }
    throw error
  } finally {
    isFormLoading.value = false
  }
}

async function updateProblem(problemId, problemData) {
try {
isFormLoading.value = true

const response = await axios.put(`${API_BASE_URL}/api/problems/${problemId}`, problemData, apiConfig.value)

if (response.data && response.data.status_code === 200) {
  alert('문제가 성공적으로 수정되었습니다.')
  return response.data.result
} else {
  throw new Error('문제 수정에 실패했습니다.')
  }

} catch (error) {
  if (error.response?.status === 404) {
  handleError(new Error('문제를 찾을 수 없습니다.'), '문제 수정')
  } else {
      handleError(error, '문제 수정')
    }
    throw error
  } finally {
    isFormLoading.value = false
  }
}

async function deleteProblem(dateGroup) {
  try {
    const confirmed = confirm(`${dateGroup.date} 날짜의 문제를 삭제하시겠습니까?\n\n제목: ${dateGroup.title || '알 수 없는 문제'}\n\n삭제된 문제는 복구할 수 없습니다.`)
    
    if (!confirmed) {
      return
    }
    
    isLoading.value = true
    
    const response = await axios.delete(`${API_BASE_URL}/api/problems/${dateGroup.problemId}`, apiConfig.value)
    
    if (response.data && response.data.status_code === 200) {
      alert('문제가 성공적으로 삭제되었습니다.')
      // 목록 새로고침
      await loadProblemList()
    } else {
      throw new Error('문제 삭제에 실패했습니다.')
    }
    
  } catch (error) {
    if (error.response?.status === 404) {
      handleError(new Error('삭제할 문제를 찾을 수 없습니다.'), '문제 삭제')
    } else if (error.response?.status === 403) {
      handleError(new Error('문제 삭제 권한이 없습니다.'), '문제 삭제')
    } else {
      handleError(error, '문제 삭제')
    }
  } finally {
    isLoading.value = false
  }
}

// ===== 이벤트 핸들러 =====
function setView(view) {
  currentView.value = view
  
  if (view === 'create') {
    selectedProblem.value = null
    selectedDate.value = ''
  }
}

async function viewProblemDetail(date) {
  selectedDate.value = date
  
  // 해당 날짜의 문제 ID 찾기
  const dateGroup = problemDateGroups.value.find(group => group.date === date)
  if (dateGroup && dateGroup.problemId) {
    try {
      selectedProblem.value = await loadProblemByDate(date)
      
      if (selectedProblem.value) {
        currentView.value = 'edit'
      }
    } catch (error) {
      // 오류는 loadProblemByDate에서 이미 처리됨
      console.error('문제 상세 정보 로드 실패:', error)
    }
  } else {
    alert('해당 날짜의 문제를 찾을 수 없습니다.')
  }
}

function goBackToList() {
  currentView.value = 'list'
  selectedProblem.value = null
  selectedDate.value = ''
}

async function handleSaveProblem(problemData) {
  try {
    if (currentView.value === 'create') {
      await createProblem(problemData)
    } else if (currentView.value === 'edit' && selectedProblem.value) {
      await updateProblem(selectedProblem.value.id, problemData)
    }

    // 성공 시 목록으로 돌아가고 새로고침
    goBackToList()
    await loadProblemList()

  } catch (error) {
    // 에러는 각 함수에서 처리됨
  }
}

async function handleRefresh() {
  if (currentView.value === 'list') {
    await loadProblemList()
  }
  emit('refresh')
}

// ===== 라이프사이클 =====
onMounted(async () => {
  if (!token) {
    alert('로그인이 필요합니다.')
    window.location.href = '/login'
    return
  }
  
  await loadProblemList()
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.admin-problem-management {
  width: 794px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0px 0px;
  background: $white;
  position: relative;
  overflow: hidden;
}

.admin-problem-header {
  height: 51px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $dim-gray;

  .title-section {
    .management-title {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
      margin: 0;
    }
  }

  .refresh-section {
    .refresh-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      color: $dark-black;
      font-size: 20px;
      transition: all 0.2s ease;

      &:hover {
        color: $main-color;
        transform: scale(1.1);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
    }
  }
}

.action-buttons {
  height: 64px;
  display: flex;
  border-bottom: 1px solid $dim-gray;

  .action-btn {
    flex: 1;
    border: none;
    background: $white;
    cursor: pointer;
    font-family: $secondary-kr;
    font-weight: 500;
    font-size: 18px;
    line-height: 1.252;
    color: $dark-black;
    transition: all 0.2s ease;

    &.list-btn {
      border-right: 1px solid $dim-gray;
    }

    &:hover {
      background-color: rgba($main-color, 0.05);
    }

    &.active {
      background-color: $main-color;
      color: $white;
    }
  }
}

.content-area {
  height: calc(778px - 51px - 64px);
  overflow-y: auto;
  position: relative;
}

.problem-list-view {
  .date-items-container {
    .date-item {
      height: 75px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid $dim-gray;

      .date-display {
        font-family: $secondary-kr;
        font-weight: 500;
        font-size: 18px;
        line-height: 1.252;
        color: $dark-black;
      }

      .action-buttons-group {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .view-edit-btn, .delete-btn {
        padding: 10px 15px;
        border: none;
        border-radius: 20px;
        color: $white;
        cursor: pointer;
        font-family: $secondary-kr;
        font-weight: 500;
        font-size: 18px;
        line-height: 1.252;
        transition: all 0.2s ease;
        min-width: 100px;

        &:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          transform: none;
        }
      }

      .view-edit-btn {
        background: $main-color;

        &:hover:not(:disabled) {
          background-color: darken($main-color, 10%);
        }
      }

      .delete-btn {
        background: #dc3545;

        &:hover:not(:disabled) {
          background-color: darken(#dc3545, 10%);
        }
      }
    }
  }

  .empty-state {
    padding: 40px 20px;
    text-align: center;
    color: $silver-black;
    font-family: $secondary-kr;
    font-size: 16px;
  }
}

.problem-form-view {
  .back-section {
    height: 76px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid $dim-gray;

    .back-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: $dark-black;
      font-size: 18px;
      padding: 5px;
      transition: all 0.2s ease;

      &:hover {
        color: $main-color;
        transform: translateX(-2px);
      }
    }

    .selected-date {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
    }
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($white, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  .loading-content {
    text-align: center;
    color: $main-color;

    i {
      font-size: 32px;
      margin-bottom: 12px;
    }

    p {
      margin: 0;
      font-family: $secondary-kr;
      font-size: 14px;
      color: $dark-black;
    }
  }
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
