import axios from 'axios';

const axiosWithoutInterceptor = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,
});

export async function refreshAccessToken() {
    try {
        console.log('refreshAccessToken() 호출');
        const response = await axiosWithoutInterceptor.post('/api/members/refresh');
        const newAccessToken = response.data.accessToken;
        if (!newAccessToken) throw new Error('accessToken 없음');
        console.log('refreshAccessToken 성공!', newAccessToken);
        // 이하 생략...
        return newAccessToken;
    } catch (err) {
        console.error('refreshAccessToken 실패:', err);
        // 여기가 반드시 실행되는지 체크!
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        throw err;
    }
}
