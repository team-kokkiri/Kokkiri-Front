<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user'

const router = useRouter();
const userStore = useUserStore();
const urlParams = new URLSearchParams(window.location.search);

const accessToken = urlParams.get('accessToken');
const email = urlParams.get('email');

if (accessToken && email) {
  try {
    // Pinia store를 통해 로그인 처리
    await userStore.login({
      tokenData: { email, role: 'user', avatar: null }, // 기본값 설정
      token: accessToken
    });

    // 로그인 성공 후 메인페이지로 이동
    router.replace('/main-page');
  } catch (error) {
    console.error('OAuth2 로그인 처리 중 오류:', error);
    router.replace('/login');
  }
} else {
  // 토큰 없으면 로그인 페이지로 이동
  router.replace('/login');
}
</script>

<template>
  <div>로그인 중입니다... 잠시만 기다려주세요.</div>
</template>
