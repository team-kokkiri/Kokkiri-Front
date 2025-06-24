import axios from 'axios';

const axiosWithoutInterceptor = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,
});

export async function refreshAccessToken() {
    try {
        const response = await axiosWithoutInterceptor.post('/api/members/refresh', null);
        const newAccessToken = response.data.accessToken;

        if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
            return newAccessToken;
        } else {
            throw new Error('accessToken 발급 실패');
        }
    } catch (err) {
        try {
            await axiosWithoutInterceptor.post('/api/members/logout', null);
        } catch (logoutErr) {
            // 로그아웃 실패는 무시
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        window.location.href = '/login';

        throw err;
    }
}
