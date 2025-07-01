import { getProfileImageUrl as baseGetProfileImageUrl } from './profileImage'
import instance from './axios'

// 사용자 아바타 캐시
const avatarCache = new Map()

/**
 * 사용자 ID로 아바타 정보를 가져오는 함수
 * @param {string|number} memberId - 사용자 ID
 * @returns {Promise<string>} 아바타 URL
 */
export const getUserAvatar = async (memberId) => {
  if (!memberId) return null
  
  // 캐시에서 먼저 확인
  if (avatarCache.has(memberId)) {
    return avatarCache.get(memberId)
  }
  
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    
    const response = await instance.get(`/api/members/${memberId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    const avatar = response.data.avatar
    avatarCache.set(memberId, avatar)
    return avatar
    
  } catch (error) {
    console.error('사용자 아바타 조회 실패:', error)
    return null
  }
}

/**
 * 확장된 프로필 이미지 URL 처리 함수
 * @param {string} avatar - 아바타 경로
 * @param {string|number} memberId - 사용자 ID (fallback용)
 * @returns {Promise<string>} 처리된 이미지 URL
 */
export const getProfileImageUrlExtended = async (avatar, memberId = null) => {
  // 아바타가 있으면 기본 함수 사용
  if (avatar) {
    return baseGetProfileImageUrl(avatar)
  }
  
  // 아바타가 없고 memberId가 있으면 API 조회
  if (memberId) {
    const fetchedAvatar = await getUserAvatar(memberId)
    return baseGetProfileImageUrl(fetchedAvatar)
  }
  
  // 둘 다 없으면 기본 이미지
  return baseGetProfileImageUrl(null)
}

/**
 * 캐시 초기화 (필요시 사용)
 */
export const clearAvatarCache = () => {
  avatarCache.clear()
}
