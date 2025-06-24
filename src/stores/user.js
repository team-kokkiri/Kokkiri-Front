// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: null,        // 토큰에서 받아올 정보
    role: null,         // 토큰에서 받아올 정보
    avatar: null,       // 토큰에서 받아올 정보
    token: null,        // JWT 토큰
    isLoggedIn: false,  // 명시적 로그인 상태
    lastLoginAt: null,  // 마지막 로그인 시간
  }),

  getters: {
    // 현재 유저 정보 (컴포넌트에서 사용하기 편하게)
    currentUser: (state) => ({
      email: state.email,
      role: state.role,
      avatar: state.avatar,
      lastLoginAt: state.lastLoginAt
    }),

    // 관리자 권한 확인
    isAdmin: (state) => state.role === 'admin',

    // 일반 유저 권한 확인
    isUser: (state) => state.role === 'user',

    // 토큰 존재 여부
    hasToken: (state) => !!state.token,

    // 사용자 표시 이름 (이메일의 @ 앞부분 사용)
    displayName: (state) => {
      if (!state.email) return null
      return state.email.split('@')[0]
    }
  },

  actions: {
    // 토큰으로부터 유저 정보 설정
    setUserInfo(tokenData) {
      this.email = tokenData.email
      this.role = tokenData.role
      this.avatar = tokenData.avatar
      this.isLoggedIn = true
      this.lastLoginAt = new Date().toISOString()
    },

    // 토큰 설정
    setToken(token) {
      this.token = token
      if (token) {
        localStorage.setItem('accessToken', token)
      } else {
        localStorage.removeItem('accessToken')
      }
    },

    // 개별 필드 업데이트 (프로필 수정용)
    updateRole(role) {
      this.role = role
    },

    updateAvatar(avatar) {
      this.avatar = avatar
    },

    // 유저 정보 초기화
    clearUser() {
      this.email = null
      this.role = null
      this.avatar = null
      this.token = null
      this.isLoggedIn = false
      this.lastLoginAt = null

      // localStorage 정리
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('email')
    },

    // 로그인 (토큰과 토큰에서 디코딩된 정보를 받음)
    async login({ tokenData, token }) {
      try {
        this.setUserInfo(tokenData)
        this.setToken(token)
        
        // 이메일을 localStorage에 별도 저장 (기존 구조 유지)
        if (tokenData.email) {
          localStorage.setItem('email', tokenData.email)
        }
        
        return { success: true }
      } catch (error) {
        console.error('Login action error:', error)
        return { success: false, error: error.message }
      }
    },

    // 로그아웃
    async logout() {
      try {
        // API 호출로 서버에서도 로그아웃 처리 (선택)
        // await api.logout()

        this.clearUser()
        return { success: true }
      } catch (error) {
        console.error('Logout action error:', error)
        // 에러가 있어도 로컬 데이터는 초기화
        this.clearUser()
        return { success: false, error: error.message }
      }
    },

    // localStorage에서 토큰을 읽어와서 디코딩하여 유저 정보 복원
    async restoreUser() {
      try {
        const accessToken = localStorage.getItem('accessToken')
        
        if (!accessToken) {
          return { success: false, message: 'No token found' }
        }

        // JWT 토큰 디코딩하여 정보 추출
        // jwt-decode 라이브러리가 이미 설치되어 있으므로 사용
        try {
          const { jwtDecode } = await import('jwt-decode')
          const decodedToken = jwtDecode(accessToken)
          
          // 토큰에서 필요한 정보 추출
          const tokenData = {
            email: decodedToken.email || decodedToken.sub, // sub는 일반적으로 사용자 식별자
            role: decodedToken.role || decodedToken.authorities?.[0] || 'user',
            avatar: decodedToken.avatar || decodedToken.picture || null
          }
          
          // 토큰 만료 확인
          const currentTime = Date.now() / 1000
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            console.warn('Token expired')
            this.clearUser()
            return { success: false, message: 'Token expired' }
          }
          
          this.setToken(accessToken)
          this.setUserInfo(tokenData)
          
          // 이메일을 localStorage에 별도 저장 (기존 구조 유지)
          if (tokenData.email) {
            localStorage.setItem('email', tokenData.email)
          }
          
          return { success: true, data: tokenData }
          
        } catch (decodeError) {
          console.error('Token decode error:', decodeError)
          this.clearUser()
          return { success: false, error: 'Invalid token format' }
        }
        
      } catch (error) {
        console.error('Restore user error:', error)
        this.clearUser()
        return { success: false, error: error.message }
      }
    },

    // 프로필 업데이트 (avatar만 변경 가능)
    async updateProfile(profileData) {
      try {
        // API 호출
        // const response = await api.updateProfile(profileData)

        // 성공시 store 업데이트 (avatar만 변경 가능)
        if (profileData.avatar !== undefined) {
          this.updateAvatar(profileData.avatar)
        }

        return { success: true }
      } catch (error) {
        console.error('Update profile error:', error)
        return { success: false, error: error.message }
      }
    },

    // 토큰 갱신 (새 토큰으로 정보 업데이트)
    async refreshToken(newToken) {
      try {
        const { jwtDecode } = await import('jwt-decode')
        const decodedToken = jwtDecode(newToken)
        
        const tokenData = {
          email: decodedToken.email || decodedToken.sub,
          role: decodedToken.role || decodedToken.authorities?.[0] || 'user',
          avatar: decodedToken.avatar || decodedToken.picture || null
        }
        
        this.setToken(newToken)
        this.setUserInfo(tokenData)
        
        return { success: true, data: tokenData }
      } catch (error) {
        console.error('Refresh token error:', error)
        return { success: false, error: error.message }
      }
    }
  }
})
