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

    updateAvatar(avatar) {
      this.avatar = avatar
    },

    updateNickname(nickname) {
      this.nickname = nickname
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
        localStorage.setItem('token', token);
        localStorage.setItem('email', userInfo.email);
        localStorage.setItem('role', userInfo.role);
        localStorage.setItem('avatar', userInfo.avatar);
        localStorage.setItem('nickname', userInfo.nickname);

        // ---- 여기서 state 로그 출력 ----
        console.log('Pinia에 저장된 토큰:', this.token);
        console.log('Pinia에 저장된 유저 정보:', this.userInfo);
        // 만약 userInfo가 없고 각각 state에 저장한다면 아래처럼
        console.log('Pinia email:', this.email);
        console.log('Pinia role:', this.role);
        console.log('Pinia avatar:', this.avatar);
        console.log('Pinia nickname:', this.nickname);

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
