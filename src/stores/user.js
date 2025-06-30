// src/stores/user.js
import { defineStore } from 'pinia'
import instance from "@/utils/axios";

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
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
      id: state.id,
      email: state.email,
      role: state.role,
      avatar: state.avatar,
      lastLoginAt: state.lastLoginAt
    }),
    isAdmin: (state) => String(state.role).toLowerCase() === 'admin',
    isUser: (state) => String(state.role).toLowerCase() === 'user',
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
      this.id = tokenData.id
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

        // axios 사용시
        const response = await instance.get('/api/members/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userInfo = response.data;

        this.setUserInfo({
          id: userInfo.id,
          email: userInfo.email,
          role: userInfo.role,
          avatar: userInfo.avatar || userInfo.avatarUrl || null,
          nickname: userInfo.nickname,
        });

        localStorage.setItem('accessToken', token);
        localStorage.setItem('id', userInfo.id);
        localStorage.setItem('email', userInfo.email);
        localStorage.setItem('role', userInfo.role);
        localStorage.setItem('avatar', userInfo.avatar);
        localStorage.setItem('nickname', userInfo.nickname);

        return { success: true };
      } catch (error) {
        console.error('Login action error:', error);
        return { success: false, error: error.message };
      }
    },

    restoreUser: async function() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.token = token;
        try {
          const response = await instance.get('/api/members/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userInfo = response.data;
          this.setUserInfo({
            id: userInfo.id,
            email: userInfo.email,
            role: userInfo.role,
            avatar: userInfo.avatar,
            nickname: userInfo.nickname,
          });
        } catch (err) {
          this.clearUser({});
        }
      } else {
        this.clearUser({});
      }
    },

    async logout() {
      try {
        // 서버 로그아웃 API 호출이 있다면 여기에 추가
        this.clearUser({})
        return { success: true }
      } catch (error) {
        console.error('Logout action error:', error)
        this.clearUser({})
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