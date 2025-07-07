import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'

/**
 * 일일 문제 관련 로직을 관리하는 컴포저블
 * @returns {Object} 일일 문제 관련 상태와 메소드들
 */
export function useDailyProblem() {
  // 반응형 상태들
  const problemData = ref(null)
  const rankings = ref([])
  const isSubmitting = ref(false)
  const executionResult = ref(null)
  const error = ref(null)

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
   * 오늘의 문제와 랭킹 정보를 서버에서 가져옴
   * GET /api/problems/today API 호출
   */
  const fetchTodaysProblem = async () => {
    try {
      error.value = null
      const config = getAuthConfig()
      const response = await axios.get(`${API_BASE_URL}/api/problems/today`, config)
      
      if (response.data.status_code === 200) {
        problemData.value = response.data.result.problem
        rankings.value = response.data.result.rankings || []
      }
    } catch (err) {
      error.value = err.response?.data?.status_message || '문제를 불러오는데 실패했습니다.'
      console.error('Failed to fetch today\'s problem:', err)
    }
  }

  /**
   * 코드를 제출하여 채점받고 랭킹에 등록
   * POST /api/submissions API 호출
   * @param {string} sourceCode - 제출할 소스 코드
   * @param {string} language - 프로그래밍 언어 (예: 'JAVA')
   * @returns {Promise<Object>} 제출 결과 객체 (submission, ranking, accepted 등 포함)
   * @throws {Error} 문제 정보가 없거나 제출 실패 시
   */
  const submitCode = async (sourceCode, language) => {
    if (!problemData.value?.id) {
      throw new Error('문제 정보가 없습니다.')
    }
    
    try {
      isSubmitting.value = true
      error.value = null
      
      const config = getAuthConfig()
      const payload = {
        problemId: problemData.value.id,
        sourceCode,
        language
      }

      const response = await axios.post(`${API_BASE_URL}/api/submissions`, payload, config)
      
      if (response.data.status_code === 200) {
        const result = response.data.result
        executionResult.value = result.submission
        
        // 새로운 랭킹이 생성된 경우 랭킹 목록 업데이트
        if (result.newRanking && result.ranking) {
          rankings.value.push(result.ranking)
          rankings.value.sort((a, b) => a.rankPosition - b.rankPosition)
        }
        
        return result
      }
    } catch (err) {
      // 400 에러인 경우 중복 제출로 간주
      if (err.response?.status === 400) {
        const duplicateError = new Error('DUPLICATE_SUBMISSION')
        duplicateError.originalError = err
        throw duplicateError
      }

      error.value = err.response?.data?.status_message || '코드 제출에 실패했습니다.'
      console.error('Failed to submit code:', err)
      throw err
    } finally {
          isSubmitting.value = false
    }
  }

  /**
   * 특정 제출의 소스 코드를 조회
   * GET /api/submissions/code/{submissionId} API 호출
   * @param {number} submissionId - 조회할 제출 ID
   * @returns {Promise<Object>} 제출 정보 객체 (소스 코드 포함)
   * @throws {Error} 조회 실패 시
   */
  const fetchSubmissionCode = async (submissionId) => {
    try {
      const config = getAuthConfig()
      const response = await axios.get(`${API_BASE_URL}/api/submissions/code/${submissionId}`, config)
      
      if (response.data.status_code === 200) {
        return response.data.result
      }
    } catch (err) {
      error.value = err.response?.data?.status_message || '제출 코드를 불러오는데 실패했습니다.'
      console.error('Failed to fetch submission code:', err)
      throw err
    }
  }

  // 컴포저블에서 노출하는 상태와 메소드들
  return {
    // 상태
    problemData,
    rankings,
    isSubmitting,
    executionResult,
    error,
    // 메소드
    fetchTodaysProblem,
    submitCode,
    fetchSubmissionCode
  }
}
