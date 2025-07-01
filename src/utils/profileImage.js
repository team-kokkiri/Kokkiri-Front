import defaultProfileImage from '@/assets/img/0.png'

/**
 * 프로필 이미지 URL을 처리하는 공통 함수
 * @param {string} avatar - 사용자 아바타 경로 또는 URL
 * @returns {string} 처리된 이미지 URL
 */
export const getProfileImageUrl = (avatar) => {
  console.log('getProfileImageUrl 호출:', avatar)
  if (!avatar) return defaultProfileImage
  
  // 이미 완전한 URL인 경우 (http/https로 시작)
  if (avatar.startsWith('http')) {
    return avatar
  }
  
  // 상대 경로인 경우 백엔드 서버 URL과 결합
  const baseUrl = 'http://localhost:9090' // 백엔드 서버 URL
  const fullUrl = baseUrl + avatar
  console.log('생성된 이미지 URL:', fullUrl)
  return fullUrl
}

/**
 * 이미지 로드 에러 처리 함수
 * @param {Event} event - 이미지 에러 이벤트
 */
export const handleImageError = (event) => {
  event.target.src = defaultProfileImage
}
