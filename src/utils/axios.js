// src/utils/axios.js
import axios from 'axios';
import { refreshAccessToken } from './token';

// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,  // 리프레시 토큰 쿠키 전달
});

//요청 인터셉터: accessToken이 있으면 자동 헤더 추가 (단, 이미 있으면 덮어쓰지 않음)
instance.interceptors.request.use(config => {
    if (!config.headers.Authorization) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// 응답 인터셉터: 401이면 refresh 후 재요청
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // 토큰 만료 시 1회만 재시도
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            console.log('401 에러! refreshAccessToken 호출 시도');

            try {
                // accessToken 재발급 (refresh 토큰은 쿠키로 자동전송)
                const newAccessToken = await refreshAccessToken();

                // localStorage에도 갱신
                localStorage.setItem('accessToken', newAccessToken);

                // 재시도 요청에 새 토큰 적용
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                console.log('재시도 /me Authorization:', originalRequest.headers.Authorization);

                // 재요청! request 인터셉터가 다시 덮어쓰지 않도록
                return instance(originalRequest);
            } catch (refreshError) {
                console.error('refreshAccessToken 실패, 로그아웃으로 이동!');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('email');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // 다른 에러는 그대로
        return Promise.reject(error);
    }
);

export default instance;
