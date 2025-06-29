import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'

export function useDailyProblem() {
  const problemData = ref(null)
  const rankings = ref([])
  const isRunning = ref(false)
  const isSubmitting = ref(false)
  const executionResult = ref(null)
  const error = ref(null)

  const getAuthConfig = () => {
    const token = localStorage.getItem('accessToken')
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  }

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

  const runCode = async (sourceCode, language) => {
    if (!problemData.value?.id) {
      throw new Error('문제 정보가 없습니다.')
    }
    
    try {
      isRunning.value = true
      error.value = null
      
      const config = getAuthConfig()
      const payload = {
        problemId: problemData.value.id,
        sourceCode,
        language
      }

      const response = await axios.post(`${API_BASE_URL}/api/problem/compiler/run`, payload, config)
      
      if (response.data.status_code === 200) {
        executionResult.value = response.data.result
        return response.data.result
      }
    } catch (err) {
      error.value = err.response?.data?.status_message || '코드 실행에 실패했습니다.'
      console.error('Failed to run code:', err)
      throw err
    } finally {
      isRunning.value = false
    }
  }

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
        
        // Update rankings if it's a new ranking
        if (result.newRanking && result.ranking) {
          rankings.value.push(result.ranking)
          rankings.value.sort((a, b) => a.rankPosition - b.rankPosition)
        }
        
        return result
      }
    } catch (err) {
      error.value = err.response?.data?.status_message || '코드 제출에 실패했습니다.'
      console.error('Failed to submit code:', err)
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

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

  return {
    problemData,
    rankings,
    isRunning,
    isSubmitting,
    executionResult,
    error,
    fetchTodaysProblem,
    runCode,
    submitCode,
    fetchSubmissionCode
  }
}
