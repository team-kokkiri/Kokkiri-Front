import axios from 'axios';
import { useUserStore } from '@/stores/user';

const axiosWithoutInterceptor = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,
});

export async function refreshAccessToken() {
    try {
        const response = await axiosWithoutInterceptor.post('/api/members/refresh');
        const newAccessToken = response.data.accessToken;

        if (!newAccessToken) throw new Error('accessToken 없음');

        // 로컬스토리지에 토큰 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 유저 정보 API 호출 (토큰이 필요하므로 axios 인스턴스 활용)
        const userStore = useUserStore();

        // axios 인스턴스가 Authorization 헤더 자동 처리하므로 아래처럼 직접 요청
        const userInfoResponse = await axiosWithoutInterceptor.get('/api/members/me', {
            headers: {
                Authorization: `Bearer ${newAccessToken}`,
            },
        });

        const userInfo = userInfoResponse.data;

        userStore.setToken(newAccessToken);
        userStore.setUserInfo({
            email: userInfo.email,
            role: userInfo.role,
            avatar: userInfo.avatar,
        });

        return newAccessToken;
    } catch (err) {
        console.error('refreshAccessToken 실패:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        throw err;
    }
}
