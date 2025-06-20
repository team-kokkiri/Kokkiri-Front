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
import axios from 'axios';

const classcode = ref('');
const classcodeError = ref('');
const router = useRouter();

// 입력 시 에러 메시지 제거
watch(classcode, () => {
  if (classcodeError.value) classcodeError.value = '';
});

const onVerifyClasscode = async () => {
  classcodeError.value = '';

  if (!classcode.value) {
    classcodeError.value = '반 코드를 입력해주세요.';
    return;
  }

  try {
    // 1. 백엔드에서 코드 유효성 검사
    const verifyRes = await axios.get(
        `http://localhost:9090/api/team/verify?code=${encodeURIComponent(classcode.value.trim())}`,
        { withCredentials: true }
    );

    if (!verifyRes.data.valid) {
      classcodeError.value = '존재하지 않는 반 코드입니다.';
      return;
    }

    // 2. 유효하면 teamCode를 세션에 저장 요청
    await axios.post('http://localhost:9090/api/team/session', {
      teamCode: classcode.value.trim(),
    }, { withCredentials: true });

    toast.success('인증이 완료되었습니다.');
    setTimeout(() => {
      router.push('/signup'); // teamCode는 세션에서 가져오게 됨
    }, 1000);
  } catch (error) {
    console.error('반 코드 검증 실패:', error);
    classcodeError.value = '반 코드 인증에 실패했습니다.';
  }
};
</script>

<style scoped>

</style>
