<template>
  <div class="login-container">
    <div class="login-inner">
      <!-- 상단 로고+서비스명 -->
      <div class="login-header-box">
        <img class="logo" src="../assets/img/로그인로고.png" alt="로고" />
      </div>

      <!-- 본문 영역 -->
      <div class="login-main-box">
        <!-- 아이디/비밀번호 입력 박스 -->
        <div class="login-field-box">
          <input type="text" v-model="email" placeholder="아이디" />
          <input type="password" v-model="password" placeholder="비밀번호" />
        </div>

        <!-- 에러 메시지 출력 영역 추가 -->
        <div v-if="errorMessage" class="error-message" style="color: red; margin-top: 8px;">
          {{ errorMessage }}
        </div>

        <!-- 로그인 버튼 -->
        <div class="login-button">
          <button class="btn-login" @click="handleLogin">KOKKIRI 로그인</button>
        </div>
        <!-- 하단 링크 -->
        <div class="login-link-box">
          <a class="login-join" href="#">회원가입</a>
          <a class="login-find" href="#">비밀번호 찾기</a>
        </div>
      </div>

      <!-- 구분선 + 간편로그인 -->
      <div class="login-divider">
        <span>간편 로그인</span>
        <div class="easy-login-box">
          <a href="#" class="sns-btn kakao"><img src="../assets/img/카카오로고.svg" alt=""></a>
          <a href="#" class="sns-btn google"><img src="../assets/img/구글로고.svg" alt=""></a>
        </div>
      </div>

    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:9090/api/members/login', {
      email: email.value,
      password: password.value,
    });

    const { accessToken, refreshToken, email: userEmail } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('email', userEmail);

    router.push('/home');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = '아이디 또는 비밀번호가 일치하지 않습니다.';
    } else {
      errorMessage.value = '로그인 중 오류가 발생했습니다.';
    }
  }
};
</script>
<style scoped>

</style>