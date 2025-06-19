<template>
  <div class="login-container">
    <div class="login-inner">
      <!-- 상단 로고+서비스명 -->
      <div class="login-header-box">
        <img class="login-logo" src="../assets/img/로그인로고.png" alt="로고" />
      </div>

      <!-- 본문 영역 -->
      <form class="login-main-box" @submit.prevent="handleLogin">
        <!-- 아이디/비밀번호 입력 박스 -->
        <div class="login-field-box">
          <input
              type="email"
              v-model="email"
              placeholder="아이디"
              autocomplete="username"
          />
          <input
              type="password"
              v-model="password"
              placeholder="비밀번호"
              autocomplete="current-password"
          />
        </div>

        <!-- 에러 메시지 출력 영역 -->
        <div v-if="errorMessage" class="input-msg-list" style="margin-bottom:12px;">
          <div class="input-msg">
            <i class="bi bi-x-lg"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <div class="login-button">
          <button class="btn-login" type="submit">KOKKIRI 로그인</button>
        </div>

        <!-- 하단 링크 -->
        <div class="login-link-box">
          <router-link class="login-join" to="/signup">회원가입</router-link>
          <router-link class="login-find" to="/find-password">비밀번호 찾기</router-link>
        </div>
      </form>

      <!-- 구분선 + 간편로그인 -->
      <div class="login-divider">
        <span>간편 로그인</span>
        <div class="easy-login-box">
          <a href="#" class="sns-btn kakao"><img src="../assets/img/카카오로고.svg" alt="카카오" /></a>
          <a href="#" class="sns-btn google"><img src="../assets/img/구글로고.svg" alt="구글" /></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/*####### 임포트 #######*/
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

/*####### 변수들 #######*/
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

/*####### 로그인 데이터 전송 #######*/
const handleLogin = async () => {
  errorMessage.value = '';
  try {
    const response = await axios.post('http://localhost:9090/api/members/login', {
      email: email.value,
      password: password.value,
    });

    const { accessToken, refreshToken, email: userEmail } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('email', userEmail);

    await router.push('/main-page');
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
/* 스타일은 회원가입과 동일하게 맞춰주면 됩니다. */
</style>
