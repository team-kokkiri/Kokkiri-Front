<template>
  <div class="classcode-container">
    <div class="classcode-inner">
      <!-- 로고 박스 -->
      <div class="classcode-logo-box">
        <img src="../../assets/img/마스코트잔디.png" alt="코끼리 로고" />
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../utils/axios';
import SuccessModal from '@/components/common/modal/SuccessModal.vue';
import { useSuccessModal } from '@/composables/useModal.js';

const classcode = ref('');
const classcodeError = ref('');
const router = useRouter();

// Success Modal 상태 관리
const { modalState, showModal, hideModal } = useSuccessModal();

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
        `/api/team/verify?code=${encodeURIComponent(classcode.value.trim())}`,
        { withCredentials: true }
    );

    if (!verifyRes.data.valid) {
      classcodeError.value = '존재하지 않는 반 코드입니다.';
      return;
    }

    // 2. 유효하면 state 생성 요청 (랜덤 UUID 받고 Redis에 teamCode 저장됨)
    const stateRes = await axios.post('/api/team/state', {
      teamCode: classcode.value.trim(),
    }, { withCredentials: true });

    const state = stateRes.data.state;
    console.log('발급된 state:', state);
    
    // Success Modal 표시
    showModal({
      message: '인증이 완료되었습니다.',
      autoClose: true,
      autoCloseDelay: 1000
    });

    setTimeout(() => {
      // state를 쿼리 파라미터로 넘겨서 회원가입 페이지 이동
      router.push(`/signup?state=${encodeURIComponent(state)}`);
    }, 1000);
  } catch (error) {
    console.error('반 코드 검증 실패:', error);
    classcodeError.value = '반 코드 인증에 실패했습니다.';
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.classcode-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .classcode-inner {
    width: 360px;
    height: 546px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
  }

  .classcode-logo-box {
    margin-top: 24px;
    margin-bottom: 14px;
    img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }
  }

  .classcode-title-box {
    text-align: center;
    margin-bottom: 24px;

    .classcode-title {
      font-size: 26px;
      font-weight: 700;
      color: $dark-black;
      margin-bottom: 10px;
    }
    .classcode-desc {
      font-size: 16px;
      color: $dark-black;
      line-height: 1.5;
      font-weight: 400;
      margin-bottom: 10px;
    }
  }

  .classcode-form-box {
    width: 100%;
    display: flex;
    flex-direction: column;

    .form-group {
      width: 100%;
      margin-bottom: 22px;

      label {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: $dark-black;
        margin-bottom: 8px;
        padding-left: 4px;
      }

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

      .input-msg-list {
        min-height: 20px;
        display: flex;
        flex-direction: column;
        gap: 1px;

        .input-msg {
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-left: 2px;
          font-weight: 430;
          margin-top: 6px;
          .bi {
            font-size: 14px;
            margin-right: 5px;
            color: $crimson;
          }
          .classcode-error,
          span {
            line-height: 1.5;
            color: $crimson;
          }
        }
      }
    }

    .btn-classcode {
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
      &:hover {
        opacity: 0.85;
      }
    }
  }
}
</style>
