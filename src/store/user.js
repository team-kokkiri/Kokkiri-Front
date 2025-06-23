// src/store/user.js

export default {
    namespaced: true,   // 모듈 네임스페이스(권장)
    state: () => ({
        userId: null,
        nickname: null,
        role: null,
        token: null,      // JWT 토큰(선택)
        // 필요한 유저 상태 더 추가 가능
    }),
    mutations: {
        setUserInfo(state, payload) {
            state.userId = payload.userId
            state.nickname = payload.nickname
            state.role = payload.role
        },
        setToken(state, token) {
            state.token = token
        },
        clearUser(state) {
            state.userId = null
            state.nickname = null
            state.role = null
            state.token = null
        }
    },
    actions: {
        // 예시: 로그인 후 유저정보, 토큰 저장
        login({ commit }, { userInfo, token }) {
            commit('setUserInfo', userInfo)
            commit('setToken', token)
        },
        logout({ commit }) {
            commit('clearUser')
            // localStorage 등 토큰 삭제도 여기서 처리 가능
        }
    },
    getters: {
        isLogin(state) {
            return !!state.userId
        },
        isAdmin(state) {
            return state.role === 'admin'
        }
    }
}
