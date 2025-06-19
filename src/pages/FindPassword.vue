<template>
  <div class="findpw-container">
    <div class="findpw-inner">
      <!-- 로고 박스 -->
      <div class="findpw-logo-box">
        <img src="../assets/img/마스코트잔디.png" alt="코끼리 로고" />
      </div>

      <!-- 타이틀, 안내문구 -->
      <div class="findpw-title-box">
        <h2 class="findpw-title">비밀번호 찾기</h2>
        <p class="findpw-desc">
          가입한 이메일을 입력해 주세요.<br />
          이메일을 통해 비밀번호 재설정 코드가 전송됩니다
        </p>
      </div>

      <!-- 이메일 입력 폼 (form 태그 사용) -->
      <form class="findpw-form-box" @submit.prevent="onFindPassword">
        <div class="form-group email-group">
          <label for="findpw-email">이메일</label>
          <input
              type="text"
              id="findpw-email"
              class="findpw-input"
              placeholder="example@email.com"
              v-model="email"
              :class="{ error: emailError }"
              autocomplete="off"
          />
          <div class="input-msg-list" v-if="emailError">
            <div class="input-msg">
              <i class="bi bi-x-lg"></i>
              <span>{{ emailError }}</span>
            </div>
          </div>
        </div>
        <button class="btn-findpw" type="submit">재설정 코드 전송하기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { watch } from 'vue';

const email = ref('');
const emailError = ref('');
const router = useRouter();

// 이메일 입력 시 에러 메시지 제거
watch(email, () => {
  if (emailError.value) emailError.value = '';
});

// 비밀번호 찾기 제출
const onFindPassword = () => {
  emailError.value = '';

  if (!email.value) {
    emailError.value = '이메일을 입력해주세요.';
  } else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
    emailError.value = '이메일 형식이 올바르지 않습니다.';
  }

  if (emailError.value) return;

  // 성공 시 라우팅 (이메일 인증 등)
  router.push('/email-verify');
};
</script>


<style scoped>

</style>