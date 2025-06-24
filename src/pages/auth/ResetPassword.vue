<template>
  <div class="resetpw-container">
    <div class="resetpw-inner">
      <!-- 로고 박스 -->
      <div class="resetpw-logo-box">
        <img src="../../assets/img/마스코트잔디.png" alt="코끼리 로고" />
      </div>

      <!-- 타이틀 -->
      <div class="resetpw-title-box">
        <h2 class="resetpw-title">비밀번호 재설정</h2>
      </div>

      <!-- 비밀번호 재설정 폼 -->
      <form class="resetpw-form-box" @submit.prevent="onResetPassword">
        <!-- 비밀번호 -->
        <div class="form-group password-group">
          <label for="resetpw-password">비밀번호</label>
          <input
              type="password"
              id="resetpw-password"
              placeholder="example001"
              v-model="password"
          />
          <div class="input-msg-list">
            <div class="input-msg">
              <i class="bi bi-check-lg" :class="{ active: isPasswordMixed }"></i>
              <span :class="{ active: isPasswordMixed }">
          영문/숫자/특수문자 중, 2가지 이상 포함
        </span>
            </div>
            <div class="input-msg">
              <i class="bi bi-check-lg" :class="{ active: isPasswordLengthValid }"></i>
              <span :class="{ active: isPasswordLengthValid }">
          8자 이상 32자 이하 입력 (공백 제외)
        </span>
            </div>
            <div class="input-msg">
              <i class="bi bi-check-lg" :class="{ active: isPasswordNoRepeat }"></i>
              <span :class="{ active: isPasswordNoRepeat }">
          연속 3자 이상 동일한 문자/숫자 제외
        </span>
            </div>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group password-check-group">
          <label for="resetpw-password-check">비밀번호 확인</label>
          <input
              type="password"
              id="resetpw-password-check"
              placeholder="example001"
              v-model="passwordCheck"
              :class="{ error: !!passwordCheckError }"
          />
          <div class="input-msg-list">
            <div v-if="passwordCheckError" class="input-msg">
              <i class="bi bi-x-lg"></i>
              <span class="password-check-error">{{ passwordCheckError }}</span>
            </div>
          </div>
        </div>

        <button class="btn-resetpw" type="submit">비밀번호 재설정</button>
      </form>
    </div>
  </div>
</template>



<script setup>
import {ref, computed, watch} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import axios from '../../utils/axios';

// 변수
const password = ref('');
const passwordCheck = ref('');
const passwordCheckError = ref('');
const router = useRouter();
const route = useRoute();

const email = route.query.email || '';

// 비밀번호/비밀번호 확인 입력이 바뀔 때 에러 즉시 제거
watch([password, passwordCheck], () => {
  if (passwordCheckError.value) passwordCheckError.value = '';
});

// 비밀번호 조건 1: 영문/숫자/특수문자 중 2가지 이상 포함
const isPasswordMixed = computed(() => {
  const pwd = password.value;
  let types = 0;
  if (/[A-Za-z]/.test(pwd)) types++;
  if (/[0-9]/.test(pwd)) types++;
  if (/[^A-Za-z0-9]/.test(pwd)) types++;
  return types >= 2;
});

// 비밀번호 조건 2: 8자 이상 32자 이하, 공백 없음
const isPasswordLengthValid = computed(() => {
  const pwd = password.value;
  return pwd.length >= 8 && pwd.length <= 32 && !/\s/.test(pwd);
});

// 비밀번호 조건 3: 연속 3자 이상 동일 문자/숫자 없음
const isPasswordNoRepeat = computed(() => {
  const pwd = password.value;
  if (pwd.length < 8) return false;
  return !/(.)\1\1/.test(pwd);
});

// 비밀번호 재설정(또는 변경) 함수 예시
const onResetPassword = async () => {
  passwordCheckError.value = '';

  // 비어있음 체크
  if (!password.value) {
    passwordCheckError.value = '비밀번호를 입력해주세요.';
    return;
  }
  if (!passwordCheck.value) {
    passwordCheckError.value = '비밀번호 확인을 입력해주세요.';
    return;
  }
  // 불일치
  if (password.value !== passwordCheck.value) {
    passwordCheckError.value = '비밀번호가 일치하지 않습니다.';
    return;
  }
  // 조건 불만족
  if (!isPasswordMixed.value || !isPasswordLengthValid.value || !isPasswordNoRepeat.value) {
    passwordCheckError.value = '비밀번호 조건을 만족시켜 주세요.';
    return;
  }

  try {
    await axios.post('/api/members/reset', {
      email: email,
      newPassword: password.value
    });

    alert('비밀번호가 성공적으로 변경되었습니다.');
    router.push('/login');
  } catch (err) {
    if (err.response && err.response.data) {
      passwordCheckError.value = err.response.data;
    } else {
      passwordCheckError.value = '비밀번호 변경 중 오류가 발생했습니다.';
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/style';

.resetpw-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .resetpw-inner {
    width: 360px;
    height: 546px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 150px;
  }

  .resetpw-logo-box {
    margin-top: 24px;
    margin-bottom: 14px;
    img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }
  }

  .resetpw-title-box {
    text-align: center;
    margin-bottom: 24px;
    .resetpw-title {
      font-size: 26px;
      font-weight: 700;
      color: $dark-black;
      margin-bottom: 10px;
    }
  }

  .resetpw-form-box {
    width: 100%;
    display: flex;
    flex-direction: column;

    .form-group {
      width: 100%;
      margin-bottom: 28px;

      label {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: $dark-black;
        margin-bottom: 8px;
        padding-left: 4px;
      }

      input[type="password"] {
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

      // 조건 리스트(체크)
      &.password-group {
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
            .bi {
              font-size: 14px;
              margin-right: 5px;
              color: $dark-gray;
              transition: color 0.2s;
            }
            span {
              line-height: 1.5;
              color: $dark-gray;
              transition: color 0.2s;
            }
            .bi.active,
            span.active {
              color: $forestgreen;
            }
          }
        }
      }

      // 비밀번호 확인 에러
      &.password-check-group {
        .input-msg-list {
          .input-msg {
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-left: 2px;
            font-weight: 430;

            .bi {
              font-size: 14px;
              margin-right: 5px;
              color: $crimson;
            }
            .password-check-error,
            span {
              line-height: 1.5;
              color: $crimson;
            }
          }
        }
      }
    }

    .btn-resetpw {
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
      margin-top: 0;
      &:hover {
        opacity: 0.85;
      }
    }
  }
}
</style>