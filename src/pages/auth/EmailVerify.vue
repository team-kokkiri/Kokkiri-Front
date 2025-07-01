<template>
  <div class="email-verification-container">
    <div class="email-verification-inner">
      <div class="email-emoji-box">
        <img src="../../assets/img/마스코트잔디.png" alt="코끼리 이모지" />
      </div>
      <div class="email-title">
        <span>인증 메일을 보내드렸어요.</span>
      </div>
      <div class="email-image-box">
        <img src="../../assets/img/love-letter.png" alt="메일 일러스트" />
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

    <!-- Success Modal -->
    <SuccessModal
      :visible="modalState.visible"
      :message="modalState.message"
      :auto-close="modalState.autoClose"
      :auto-close-delay="modalState.autoCloseDelay"
      @close="hideModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '../../utils/axios';
import { watch } from 'vue';
import SuccessModal from '@/components/common/SuccessModal.vue';
import { useSuccessModal } from '@/composables/useModal.js';

const code = ref('');
const error = ref('');
const router = useRouter();
const route = useRoute();
const email = route.query.email || '';
const type = route.query.type || "signup";

// Success Modal 상태 관리
const { modalState, showModal, hideModal } = useSuccessModal();

// 코드 입력 시 에러 자동 제거
watch(code, () => {
  if (error.value) error.value = '';
});

// 서버에서 온 인증코드가 "123456"이라고 가정
//const correctCode = "123456";

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

  try {
    // 서버에 인증 요청 보내기
    await axios.post('/api/email/verify', null, {
      params: {
        email: email,
        code: code.value,
        type: type
      },
      withCredentials: true
    });

    if (type === 'signup') {
      showModal({
        message: '인증이 완료되었습니다.',
        autoClose: true,
        autoCloseDelay: 1500
      });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else if (type === 'reset') {
      showModal({
        message: '이메일 인증 성공! 비밀번호를 재설정해주세요.',
        autoClose: true,
        autoCloseDelay: 1500
      });
      setTimeout(() => {
        router.push({ path: '/reset-password', query: { email } }); // 비번 재설정 페이지
      }, 1500);
    }

  } catch (err) {
    if (err.response && err.response.data) {
      error.value = err.response.data;
    } else {
      error.value = '인증 중 오류가 발생했습니다.';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ###### EmailVerify-Page #######*/
.email-verification-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .email-verification-inner {
    width: 360px;
    height: 546px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 150px;
  }

  .email-emoji-box {
    margin-top: 24px;
    margin-bottom: 14px;
    img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }
  }

  .email-title {
    font-size: 26px;
    font-weight: 700;
    color: $dark-black;
    text-align: center;
    margin-bottom: 24px;
    span {
      display: block;
    }
  }

  .email-image-box {
    margin-bottom: 24px;
    img {
      width: 120px;
      height: 120px;
      object-fit: contain;
    }
  }

  .email-desc-box {
    margin-bottom: 36px;
    .email-desc-main {
      span {
        display: block;
        font-size: 16px;
        color: $dark-black;
        line-height: 1.5;
        text-align: center;
        font-weight: 400;
      }
    }
  }

  .email-code-form {
    width: 100%;
    display: flex;
    flex-direction: column;

    .email-code-label {
      font-size: 16px;
      font-weight: 600;
      color: $dark-black;
      margin-bottom: 8px;
      padding-left: 4px;
      span {
        vertical-align: middle;
      }
    }

    .email-code-input-wrap {
      margin-bottom: 6px;
      input[type="text"] {
        width: 100%;
        height: 50px;
        padding: 0 14px;
        border: 1px solid $dark-gray;
        border-radius: 10px;
        font-size: 18px;
        transition: border-color 0.2s;
        outline: none;
        &::placeholder {
          color: $light-black;
          font-size: 16px;
        }
        &:focus {
          border: 2px solid $main-color;
          background: white;
        }
        &:focus::placeholder {
          color: white;
        }
        &.error {
          border: 1px solid $crimson;
          color: $crimson;
        }
        &.error::placeholder {
          color: $crimson;
        }
        &.error:focus {
          border: 2px solid $crimson;
        }
        &.error:focus::placeholder {
          color: white;
        }
      }
    }

    .email-code-error {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-left: 2px;
      font-weight: 430;
      margin-bottom: 18px;
      .bi {
        font-size: 14px;
        margin-right: 5px;
        color: $crimson;
      }
      span {
        line-height: 1.5;
        color: $crimson;
      }
    }

    .email-submit-box {
      width: 100%;
      button.btn-email-submit {
        width: 100%;
        height: 50px;
        border-radius: 15px;
        background: $main-color;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        border: none;
        cursor: pointer;
        transition: background 0.2s;
        margin-top: 6px;
        &:hover {
          opacity: 0.85;
        }
      }
    }
  }
}
</style>