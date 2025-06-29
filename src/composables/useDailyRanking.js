import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'

/**
 * 일일 문제 랭킹 관련 로직을 관리하는 컴포저블
 * @returns {Object} 랭킹 관련 상태와 메소드들
 */
export function useDailyRanking() {
  // 반응형 상태들
  const rankings = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const expandedRankingId = ref(null)
  const submissionCode = ref(null)
  const isLoadingCode = ref(false)

  /**
   * 인증 토큰이 포함된 Axios 설정 객체를 생성
   * @returns {Object} Authorization 헤더가 포함된 설정 객체
   */
  const getAuthConfig = () => {
    const token = localStorage.getItem('accessToken')
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  }

  /**
   * 오늘의 랭킹 목록을 서버에서 가져옴
   * GET /api/rankings/today API 호출
   */
  const fetchTodayRankings = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const config = getAuthConfig()
      const response = await axios.get(`${API_BASE_URL}/api/rankings/today`, config)
      
      if (response.data.status_code === 200) {
        rankings.value = response.data.result
      }
    } catch (err) {
      error.value = err.response?.data?.status_message || '랭킹을 불러오는데 실패했습니다.'
      console.error('Failed to fetch rankings:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 특정 제출의 소스 코드를 가져옴
   * GET /api/submissions/code/{submissionId} API 호출
   * @param {number} submissionId - 조회할 제출 ID
   */
  const fetchSubmissionCode = async (submissionId) => {
    try {
      isLoadingCode.value = true
      error.value = null
      
      const config = getAuthConfig()
      const response = await axios.get(`${API_BASE_URL}/api/submissions/code/${submissionId}`, config)
      
      if (response.data.status_code === 200) {
        submissionCode.value = response.data.result
        return response.data.result
      }
    } catch (err) {
      error.value = err.response?.data?.status_message || '코드를 불러오는데 실패했습니다.'
      console.error('Failed to fetch submission code:', err)
      throw err
    } finally {
      isLoadingCode.value = false
    }
  }

  /**
   * 랭킹 아이템의 드롭다운 토글
   * 이미 열려있으면 닫고, 닫혀있으면 열어서 코드를 로드
   * @param {number} rankingId - 랭킹 ID
   * @param {number} submissionId - 제출 ID
   */
  const toggleRankingExpansion = async (rankingId, submissionId) => {
    // 같은 아이템을 클릭하면 닫기
    if (expandedRankingId.value === rankingId) {
      expandedRankingId.value = null
      submissionCode.value = null
      return
    }

    // 새로운 아이템 열기
    expandedRankingId.value = rankingId
    submissionCode.value = null
    
    try {
      await fetchSubmissionCode(submissionId)
    } catch (error) {
      // 에러 발생 시 드롭다운 닫기
      expandedRankingId.value = null
    }
  }

  /**
   * 시간을 사용자 친화적인 형태로 포맷팅
   * @param {string} dateTimeString - ISO 날짜 문자열
   * @returns {string} 포맷팅된 시간 문자열
   */
  const formatSolveTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  /**
   * 실행 시간을 사용자 친화적인 형태로 포맷팅
   * @param {number} executionTime - 실행 시간 (밀리초)
   * @returns {string} 포맷팅된 실행 시간 문자열
   */
  const formatExecutionTime = (executionTime) => {
    return `${executionTime}ms`
  }

  // 컴포저블에서 노출하는 상태와 메소드들
  return {
    // 상태
    rankings,
    isLoading,
    error,
    expandedRankingId,
    submissionCode,
    isLoadingCode,
    // 메소드
    fetchTodayRankings,
    fetchSubmissionCode,
    toggleRankingExpansion,
    formatSolveTime,
    formatExecutionTime
  }
}
