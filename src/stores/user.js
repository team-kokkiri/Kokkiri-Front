// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: null,
    role: null,
    avatar: null,
    nickname:null,
    token: null,
    isLoggedIn: false,
    lastLoginAt: null,
  }),

  getters: {
    currentUser: (state) => ({
      email: state.email,
      role: state.role,
      avatar: state.avatar,
      lastLoginAt: state.lastLoginAt
    }),
    isAdmin: (state) => state.role === 'admin',
    isUser: (state) => state.role === 'user',
    hasToken: (state) => !!state.token,
    displayName: (state) => {
      if(state.nickname) return state.nickname;
      if (!state.email) return null
      return state.email.split('@')[0]
    }
  },

  actions: {
    setUserInfo(tokenData) {
      console.log('setUserInfo called', tokenData);
      this.email = tokenData.email
      this.role = tokenData.role
      this.avatar = tokenData.avatar
      this.nickname = tokenData.nickname
      this.isLoggedIn = true
      this.lastLoginAt = new Date().toISOString()
    },

    setToken(token) {
      this.token = token
      if (token) {
        localStorage.setItem('accessToken', token)
      } else {
        localStorage.removeItem('accessToken')
      }
    },

    updateRole(role) {
      this.role = role
    },

    updateAvatar(avatar) {
      this.avatar = avatar
    },

    clearUser({ preserveRefreshToken = false }) {
      this.email = null
      this.role = null
      this.avatar = null
      this.token = null
      this.isLoggedIn = false
      this.lastLoginAt = null

      console.log('clearUser called', { preserveRefreshToken });
      localStorage.removeItem('accessToken')
      localStorage.removeItem('email')
      if (!preserveRefreshToken) {
        localStorage.removeItem('refreshToken')
      }
    },

    async login({ token }) {
      try {
        this.setToken(token);

        // 로그인 직후 /api/members/me 호출해서 유저 정보 가져오기
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/members/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include', // 쿠키(리프레시 토큰) 전송 위해 필요
        });

        if (!response.ok) throw new Error('회원 정보 조회 실패');

        const userInfo = await response.json();

        this.setUserInfo({
          email: userInfo.email,
          role: userInfo.role,
          avatar: userInfo.avatar || userInfo.avatarUrl || null,
          nickname: userInfo.nickname,
        });

        // email도 localStorage에 저장해도 괜찮으면 저장
        if (userInfo.email) {
          localStorage.setItem('email', userInfo.email);
        }

        return { success: true };
      } catch (error) {
        console.error('Login action error:', error);
        return { success: false, error: error.message };
      }
    }
,

    async logout() {
      try {
        // 서버 로그아웃 API 호출이 있다면 여기에 추가
        this.clearUser()
        return { success: true }
      } catch (error) {
        console.error('Logout action error:', error)
        this.clearUser()
        return { success: false, error: error.message }
      }
    },

    async restoreUser() {
      const accessToken = localStorage.getItem('accessToken')

      try {
        const { jwtDecode } = await import('jwt-decode')

        if (accessToken) {
          const decodedToken = jwtDecode(accessToken)
          const currentTime = Date.now() / 1000

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            console.warn('액세스토큰 만료.. 리프래시토큰 검증 중..')
            return await this.restoreByRefresh()
          }

          //토큰은 유효 → /api/members/me 호출해서 닉네임 포함 정보 복원
          const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/members/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
          })

          if (!response.ok) throw new Error('회원 정보 조회 실패')

          const tokenData = {
            email: decodedToken.email || decodedToken.sub,
            role: decodedToken.role || decodedToken.authorities?.[0] || 'user',
            avatar: decodedToken.avatar || decodedToken.picture || null,
            nickname: decodedToken.nickname,
          }

          this.setToken(accessToken)
          this.setUserInfo(tokenData)
          return { success: true }
        } else {
          return await this.restoreByRefresh()
        }
      } catch (error) {
        console.error('restoreUser error:', error)
        return await this.restoreByRefresh()
      }
    },

    async restoreByRefresh() {
      try {
        // token.js 에서 export한 refreshAccessToken 함수를 import해서 사용
        const { refreshAccessToken } = await import('@/utils/token')
        const newToken = await refreshAccessToken()

        const { jwtDecode } = await import('jwt-decode')
        const decodedToken = jwtDecode(newToken)

        const tokenData = {
          email: decodedToken.email || decodedToken.sub,
          role: decodedToken.role || decodedToken.authorities?.[0] || 'user',
          avatar: decodedToken.avatar || decodedToken.picture || null,
        }

        this.setToken(newToken)
        this.setUserInfo(tokenData)
        return { success: true }
      } catch (e) {
        console.error('restoreByRefresh 실패:', e)
        this.clearUser({ preserveRefreshToken: true })
        return { success: false, error: e.message }
      }
    },

    async updateProfile(profileData) {
      try {
        if (profileData.avatar !== undefined) {
          this.updateAvatar(profileData.avatar)
        }
        return { success: true }
      } catch (error) {
        console.error('Update profile error:', error)
        return { success: false, error: error.message }
      }
    },
  }
})
