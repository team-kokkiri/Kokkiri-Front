// src/store/user.js

// 사용법

// 컴포넌트에서 이렇게 가져다 쓰면 됨
// import { computed } from 'vue'
// import { useStore } from 'vuex'

// const store = useStore()
// const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
// const currentUser = computed(() => store.getters['user/currentUser'])
// const userId = computed(() => store.getters['user/userId'])

// currentUser.value.id      
// currentUser.value.nickname) 
// currentUser.value.email)    // 이런식으로 대충 사용하면 됨

//
export default {
    namespaced: true,   // 모듈 네임스페이스(권장)

    state: () => ({
        userId: null,
        nickname: null,
        email: null,        // 이메일 추가
        role: null,
        avatar: null,       // 프로필 이미지
        token: null,        // JWT 토큰
        isLoggedIn: false,  // 명시적 로그인 상태
        lastLoginAt: null,  // 마지막 로그인 시간
    }),

    mutations: {
        // 유저 정보 설정
        SET_USER_INFO(state, payload) {
            state.userId = payload.userId
            state.nickname = payload.nickname
            state.email = payload.email
            state.role = payload.role
            state.avatar = payload.avatar
            state.isLoggedIn = true
            state.lastLoginAt = new Date().toISOString()
        },

        // 토큰 설정
        SET_TOKEN(state, token) {
            state.token = token
            // 기존 localStorage 구조 유지 (accessToken으로 저장)
            if (token) {
                localStorage.setItem('accessToken', token)
            } else {
                localStorage.removeItem('accessToken')
            }
        },

        // 개별 필드 업데이트 (프로필 수정용)
        UPDATE_NICKNAME(state, nickname) {
            state.nickname = nickname
        },

        UPDATE_AVATAR(state, avatar) {
            state.avatar = avatar
        },

        // 유저 정보 초기화
        CLEAR_USER(state) {
            state.userId = null
            state.nickname = null
            state.email = null
            state.role = null
            state.avatar = null
            state.token = null
            state.isLoggedIn = false
            state.lastLoginAt = null

            // 기존 localStorage 구조에 맞춰서 삭제
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('email')
        },

        // 토큰으로부터 유저 정보 복원
        RESTORE_USER(state, payload) {
            if (payload) {
                state.userId = payload.userId
                state.nickname = payload.nickname
                state.email = payload.email
                state.role = payload.role
                state.avatar = payload.avatar
                state.isLoggedIn = true
            }
        }
    },

    actions: {
        // 로그인
        async login({ commit }, { userInfo, token }) {
            try {
                commit('SET_USER_INFO', userInfo)
                commit('SET_TOKEN', token)
                return { success: true }
            } catch (error) {
                console.error('Login action error:', error)
                return { success: false, error: error.message }
            }
        },

        // 로그아웃
        async logout({ commit }) {
            try {
                // API 호출로 서버에서도 로그아웃 처리 (선택)
                // await api.logout()

                commit('CLEAR_USER')
                return { success: true }
            } catch (error) {
                console.error('Logout action error:', error)
                // 에러가 있어도 로컬 데이터는 초기화
                commit('CLEAR_USER')
                return { success: false, error: error.message }
            }
        },

        // localStorage에서 토큰 읽어와서 유저 정보 복원
        async restoreUser({ commit }) {
            try {
                const accessToken = localStorage.getItem('accessToken')
                const email = localStorage.getItem('email')

                if (!accessToken || !email) {
                    return { success: false, message: 'No token or email found' }
                }

                // 토큰이 있으면 로그인 상태로 설정
                commit('SET_TOKEN', accessToken)
                commit('SET_USER_INFO', {
                    userId: null,        // 서버에서 추가 정보 받기 전까지 null
                    nickname: null,      // 필요시 토큰으로 유저 정보 API 호출
                    email: email,
                    role: 'user',        // 기본값
                    avatar: null
                })

                return { success: true }
            } catch (error) {
                console.error('Restore user error:', error)
                commit('CLEAR_USER')
                return { success: false, error: error.message }
            }
        },

        // 프로필 업데이트
        async updateProfile({ commit }, profileData) {
            try {
                // API 호출
                // const response = await api.updateProfile(profileData)

                // 성공시 store 업데이트
                if (profileData.nickname) {
                    commit('UPDATE_NICKNAME', profileData.nickname)
                }
                if (profileData.avatar) {
                    commit('UPDATE_AVATAR', profileData.avatar)
                }

                return { success: true }
            } catch (error) {
                console.error('Update profile error:', error)
                return { success: false, error: error.message }
            }
        }
    },

    getters: {
        // 로그인 상태 확인
        isLoggedIn: (state) => state.isLoggedIn,

        // 관리자 권한 확인
        isAdmin: (state) => state.role === 'admin',

        // 일반 유저 권한 확인
        isUser: (state) => state.role === 'user',

        // 현재 유저 정보 (컴포넌트에서 사용하기 편하게)
        currentUser: (state) => ({
            id: state.userId,
            nickname: state.nickname,
            email: state.email,
            role: state.role,
            avatar: state.avatar,
            lastLoginAt: state.lastLoginAt
        }),

        // 토큰 존재 여부
        hasToken: (state) => !!state.token,

        // 유저 ID (게시글 작성자 비교용)
        userId: (state) => state.userId
    }
}