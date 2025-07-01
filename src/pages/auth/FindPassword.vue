<template>
  <div class="findpw-container">
    <div class="findpw-inner">
      <!-- 로고 박스 -->
      <div class="findpw-logo-box">
        <img src="../../assets/img/마스코트잔디.png" alt="코끼리 로고" />
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

    <!-- Loading Modal -->
    <LoadingModal
      :visible="loadingModalState.visible"
      :message="loadingModalState.message"
      :sub-message="loadingModalState.subMessage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import axios from '../../utils/axios';
import LoadingModal from '@/components/common/modal/LoadingModal.vue';
import { useLoadingModal } from '@/composables/useModal.js';

const email = ref('');
const emailError = ref('');
const router = useRouter();

// Loading Modal 상태 관리
const { loadingModalState, showLoadingModal, hideLoadingModal } = useLoadingModal();

// 이메일 입력 시 에러 메시지 제거
watch(email, () => {
  if (emailError.value) emailError.value = '';
});

// 비밀번호 찾기 제출
const onFindPassword = async () => {
  emailError.value = '';

  if (!email.value) {
    emailError.value = '이메일을 입력해주세요.';
  } else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
    emailError.value = '이메일 형식이 올바르지 않습니다.';
  }

    if (emailError.value) return;
  try {
    // Loading Modal 표시
    showLoadingModal({
      message: '인증 메일을 발송중입니다',
      subMessage: '잠시만 기다려주세요!'
    });

    await axios.post('/api/email/send', null, {
      params: {
        email: email.value,
        type: 'reset'
      }
    });

    // 로딩 모달 숨기기
    hideLoadingModal();

    // 성공 시 인증 코드 입력 페이지로 이동
    router.push({ path: '/email-verify', query: { email: email.value, type: 'reset' } });
  } catch (err) {
    // 에러 시 로딩 모달 숨기기
    hideLoadingModal();
    
    if (err.response?.status === 404) {
      emailError.value = '가입된 이메일이 아닙니다.';
    } else {
      emailError.value = '이메일 전송 중 오류가 발생했습니다.';
    }
  }
};
</script>


<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ###### FindPassword-Page #######*/
.findpw-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .findpw-inner {
    width: 360px;
    height: 546px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 150px;
  }

  .findpw-logo-box {
    margin-top: 24px;
    margin-bottom: 14px;
    img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }
  }

  .findpw-title-box {
    text-align: center;
    margin-bottom: 24px;

    .findpw-title {
      font-size: 26px;
      font-weight: 700;
      color: $dark-black;
      margin-bottom: 10px;
    }
    .findpw-desc {
      font-size: 16px;
      color: $dark-black;
      line-height: 1.5;
      font-weight: 400;
      span {
        display: block;
      }
    }
  }

  .findpw-form-box {
    width: 100%;
    display: flex;
    flex-direction: column;

    .form-group {
      width: 100%;

      label {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: $dark-black;
        margin-bottom: 8px;
        padding-left: 4px;
      }
      .findpw-input {
        width: 100%;
        height: 50px;
        padding: 0 14px;
        border: 1px solid $dark-gray;
        border-radius: 10px;
        font-size: 18px;
        transition: border-color 0.2s;
        outline: none;
        margin-bottom: 6px;
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
        margin-top: 6px;
        margin-bottom: 18px;
        .input-msg {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 430;
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
      }
    }

    .btn-findpw {
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
</style>