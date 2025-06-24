import axios from 'axios';
import { refreshAccessToken } from './token';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,  // 쿠키 전송 허용
});

// 요청 인터셉터: accessToken이 있다면 자동으로 헤더에 첨부
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터: 401 발생 시 토큰 재발급 및 재요청
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
