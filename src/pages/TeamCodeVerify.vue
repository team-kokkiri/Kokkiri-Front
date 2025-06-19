<template>
  <div class="classcode-container">
    <div class="classcode-inner">
      <!-- 로고 박스 -->
      <div class="classcode-logo-box">
        <img src="../assets/img/마스코트잔디.png" alt="코끼리 로고" />
      </div>

      <!-- 타이틀/설명 -->
      <div class="classcode-title-box">
        <h2 class="classcode-title">회원가입</h2>
        <p class="classcode-desc">회원가입을 위해 반 코드를 입력해주세요.</p>
      </div>

      <!-- 반 코드 입력 폼 -->
      <form class="classcode-form-box" @submit.prevent="onVerifyClasscode">
        <div class="form-group classcode-group">
          <label for="signup-classcode">반 코드</label>
          <input
              type="text"
              id="signup-classcode"
              placeholder="반 코드를 입력하세요"
              v-model="classcode"
              :class="{ error: !!classcodeError }"
              autocomplete="off"
          />
          <div class="input-msg-list">
            <div v-if="classcodeError" class="input-msg">
              <i class="bi bi-x-lg"></i>
              <span class="classcode-error">{{ classcodeError }}</span>
            </div>
          </div>
        </div>
        <button class="btn-classcode" type="submit">반 코드 인증하기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const classcode = ref('');
const classcodeError = ref('');
const router = useRouter();

// 입력 시 에러메시지 제거
watch(classcode, () => {
  if (classcodeError.value) classcodeError.value = '';
});

// 서버에 저장된 올바른 반 코드(예시)
const correctClasscode = "123456";

// 인증 버튼 클릭 시
const onVerifyClasscode = () => {
  classcodeError.value = '';

  // 1. 빈 값
  if (!classcode.value) {
    classcodeError.value = '반 코드를 입력해주세요.';
    return;
  }

  // 2. 코드 불일치
  if (classcode.value !== correctClasscode) {
    classcodeError.value = '반 코드가 일치하지 않습니다';
    return;
  }

  toast.success('인증이 완료되었습니다.');
  setTimeout(() => {
    router.push('/signup');
  }, 1500);
};
</script>

<style scoped>

</style>