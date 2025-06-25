<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const urlParams = new URLSearchParams(window.location.search);

// URL에서 토큰 및 사용자 정보 추출
const accessToken = urlParams.get('accessToken');
const email = urlParams.get('email');

async function loginWithToken() {
  if (accessToken && email) {
    try {
      // userStore에 로그인 처리 (토큰과 유저 정보 저장)
      await userStore.login({ token: accessToken });

      // 보안상 URL에서 토큰 정보 제거 (히스토리 조작)
      window.history.replaceState({}, document.title, '/oauth2-redirect');

      // 로그인 완료 후 메인 페이지로 이동
      router.replace('/main-page');
    } catch (error) {
      console.error('OAuth2 로그인 처리 중 오류:', error);
      router.replace('/login');
    }
  } else {
    // 토큰 없으면 로그인 페이지로
    router.replace('/login');
  }
}

loginWithToken();
</script>

<template>
  <div>로그인 중입니다... 잠시만 기다려주세요.</div>
</template>
