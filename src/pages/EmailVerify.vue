<template>
  <div class="email-verification-container">
    <div class="email-verification-inner">
      <div class="email-emoji-box">
        <img src="../assets/img/마스코트잔디.png" alt="코끼리 이모지" />
      </div>
      <div class="email-title">
        <span>인증 메일을 보내드렸어요.</span>
      </div>
      <div class="email-image-box">
        <img src="../assets/img/love-letter.png" alt="메일 일러스트" />
      </div>
      <div class="email-desc-box">
        <div class="email-desc-main">
        <span>
          메일함을 확인해 주세요.<br>
          인증코드를 입력하셔야<br>
          정상적으로 회원가입이 완료됩니다!
        </span>
        </div>
      </div>
      <form class="email-code-form" @submit.prevent="onVerify">
        <label class="email-code-label">
          <span>인증코드</span>
        </label>
        <div class="email-code-input-wrap">
          <input
              type="text"
              class="email-code-input"
              v-model="code"
              placeholder="인증코드 입력"
              maxlength="10"
              :class="{ error: !!error }"
          />
        </div>
        <div class="email-code-error" v-if="error">
          <i class="bi bi-x-lg"></i>
          <span>{{ error }}</span>
        </div>
        <div class="email-submit-box">
          <button type="submit" class="btn-email-submit">이메일 인증하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const code = ref('');
const error = ref('');
const router = useRouter();

// 코드 입력 시 에러 자동 제거
watch(code, () => {
  if (error.value) error.value = '';
});

// 서버에서 온 인증코드가 "123456"이라고 가정
const correctCode = "123456";

const onVerify = async () => {
  error.value = '';

  // 빈 값 체크
  if (!code.value) {
    error.value = '인증코드를 입력해주세요.';
    return;
  }

  // 길이 검사(필요하면 추가)
  if (code.value.length < 6) {
    error.value = '6자리 인증코드를 입력해주세요.';
    return;
  }

  // 예시: 코드가 다르면 에러
  if (code.value !== correctCode) {
    error.value = '인증코드가 올바르지 않습니다';
    return;
  }

  // 인증 성공 시 알림메세지
  toast.success('인증이 완료되었습니다.');
  // 성공 시 다음 페이지 이동
  setTimeout(() => {
    router.push('/login');
  }, 1500);
};
</script>

<style scoped>

</style>