<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const urlParams = new URLSearchParams(window.location.search);

const accessToken = urlParams.get('accessToken');
const email = urlParams.get('email');

if (accessToken && email) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('email', email);

  // 토큰 저장 후 메인페이지로 이동
  router.replace('/main-page');
} else {
  // 토큰 없으면 로그인 페이지로 이동
  router.replace('/login');
}
</script>

<template>
  <div>로그인 중입니다... 잠시만 기다려주세요.</div>
</template>
