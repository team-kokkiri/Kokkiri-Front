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
    console.log('반 코드 검증 요청 전송:', classcode.value);
    // 백엔드 API 호출 (/api/team/verify?code=반코드)
    const response = await axios.get(`http://localhost:9090/api/team/verify?code=${encodeURIComponent(classcode.value)}`);

    console.log('반 코드 검증 응답:', response);

    toast.success('인증이 완료되었습니다.');

    // 1.5초 후 회원가입 페이지로 이동하며 teamCode 쿼리 전달
    setTimeout(() => {
      router.push(`/signup?teamCode=${encodeURIComponent(classcode.value)}`);
    }, 1500);
  } catch (error) {
    // API가 400 오류 등 반환 시
    classcodeError.value = '반 코드가 일치하지 않습니다.';
  }
};
</script>

<style scoped>

</style>
