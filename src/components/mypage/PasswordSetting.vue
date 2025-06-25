<template>
  <div class="password-setting-wrap">
    <div class="password-setting-box">
      <div class="setting-header">
        <button
            class="back-btn"
            @click="$emit('back')"
        >
          <i class="bi bi-arrow-left"></i>
        </button>
        <span class="setting-title">비밀번호 변경</span>
      </div>

      <div class="input-section">
        <!-- 현재 비밀번호 -->
        <div class="input-group">
          <label for="current-password">현재 비밀번호</label>
          <input
              type="password"
              id="current-password"
              v-model="currentPassword"
              placeholder="현재 비밀번호 입력"
              class="password-input"
              :class="{ error: !!currentPasswordError }"
              @input="resetCurrentPasswordError"
          />
        </div>

        <!-- 변경 비밀번호 -->
        <div class="input-group">
          <label for="new-password">변경 비밀번호</label>
          <input
              type="password"
              id="new-password"
              v-model="newPassword"
              placeholder="변경 비밀번호 입력"
              class="password-input"
              @input="resetValidation"
          />
        </div>

        <!-- 비밀번호 조건 표시 -->
        <div class="password-rules">
          <div class="rule-item">
            <i class="bi bi-check-lg" :class="{ active: isPasswordMixed }"></i>
            <span :class="{ active: isPasswordMixed }">
              영문/숫자/특수문자 중, 2가지 이상 포함
            </span>
          </div>
          <div class="rule-item">
            <i class="bi bi-check-lg" :class="{ active: isPasswordLengthValid }"></i>
            <span :class="{ active: isPasswordLengthValid }">
              8자 이상 32자 이하 입력 (공백 제외)
            </span>
          </div>
          <div class="rule-item">
            <i class="bi bi-check-lg" :class="{ active: isPasswordNoRepeat }"></i>
            <span :class="{ active: isPasswordNoRepeat }">
              연속 3자 이상 동일한 문자/숫자 제외
            </span>
          </div>
        </div>

        <div class="button-group">
          <button
              class="current-password-check-btn"
              @click="checkCurrentPassword"
              :disabled="!currentPassword.trim()"
          >
            현재 비밀번호 확인
          </button>
          <button
              class="save-btn"
              @click="savePassword"
              :disabled="!isCurrentPasswordVerified || !isNewPasswordValid"
          >
            저장
          </button>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="currentPasswordError" class="error-message">
          <i class="bi bi-x-lg"></i>
          <span>{{ currentPasswordError }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineExpose, ref, computed, watch } from 'vue'

const emit = defineEmits(['back', 'save', 'verify-current-password'])

// 반응형 데이터
const currentPassword = ref('') // 현재 비밀번호
const newPassword = ref('') // 새 비밀번호
const currentPasswordError = ref('') // 현재 비밀번호 에러 메시지
const isCurrentPasswordVerified = ref(false) // 현재 비밀번호 확인 여부

/**
 * 입력값 변경 시 유효성 검증 상태 초기화
 */
watch([currentPassword, newPassword], () => {
  if (currentPasswordError.value) currentPasswordError.value = ''
})

/**
 * 현재 비밀번호 에러 초기화
 */
const resetCurrentPasswordError = () => {
  currentPasswordError.value = ''
  isCurrentPasswordVerified.value = false
}

/**
 * 새 비밀번호 입력 시 유효성 검증 초기화
 */
const resetValidation = () => {
  // 새 비밀번호 변경 시 특별한 처리는 없음 (실시간 검증)
}

/**
 * 비밀번호 조건 1: 영문/숫자/특수문자 중 2가지 이상 포함
 */
const isPasswordMixed = computed(() => {
  const pwd = newPassword.value
  let types = 0
  if (/[A-Za-z]/.test(pwd)) types++
  if (/[0-9]/.test(pwd)) types++
  if (/[^A-Za-z0-9]/.test(pwd)) types++
  return types >= 2
})

/**
 * 비밀번호 조건 2: 8자 이상 32자 이하, 공백 없음
 */
const isPasswordLengthValid = computed(() => {
  const pwd = newPassword.value
  return pwd.length >= 8 && pwd.length <= 32 && !/\s/.test(pwd)
})

/**
 * 비밀번호 조건 3: 연속 3자 이상 동일 문자/숫자 없음
 */
const isPasswordNoRepeat = computed(() => {
  const pwd = newPassword.value
  if (pwd.length < 8) return false
  return !/(.)\1\1/.test(pwd)
})

/**
 * 새 비밀번호 유효성 검증
 */
const isNewPasswordValid = computed(() => {
  return isPasswordMixed.value && isPasswordLengthValid.value && isPasswordNoRepeat.value
})

/**
 * 현재 비밀번호 확인 요청
 */
const checkCurrentPassword = async () => {
  if (!currentPassword.value.trim()) return

  emit('verify-current-password', currentPassword.value.trim())
}

/**
 * 비밀번호 변경 저장 요청
 */
const savePassword = async () => {
  // 유효성 검사
  if (!currentPassword.value.trim()) {
    currentPasswordError.value = '현재 비밀번호를 입력해주세요.'
    return
  }

  if (!newPassword.value.trim()) {
    currentPasswordError.value = '새 비밀번호를 입력해주세요.'
    return
  }

  if (!isCurrentPasswordVerified.value) {
    currentPasswordError.value = '현재 비밀번호를 먼저 확인해주세요.'
    return
  }

  if (!isNewPasswordValid.value) {
    currentPasswordError.value = '새 비밀번호 조건을 만족시켜 주세요.'
    return
  }

  if (currentPassword.value === newPassword.value) {
    currentPasswordError.value = '현재 비밀번호와 새 비밀번호가 동일합니다.'
    return
  }

  emit('save', {
    currentPassword: currentPassword.value.trim(),
    newPassword: newPassword.value.trim()
  })
}

/**
 * 부모 컴포넌트에서 현재 비밀번호 확인 결과를 받아 처리하는 함수
 * @param {boolean} result - 현재 비밀번호 확인 결과
 */
const setCurrentPasswordVerification = (result) => {
  isCurrentPasswordVerified.value = result
  if (!result) {
    currentPasswordError.value = '현재 비밀번호가 일치하지 않습니다.'
  } else {
    currentPasswordError.value = ''
  }
}

// 부모에서 호출할 수 있도록 expose
defineExpose({
  setCurrentPasswordVerification
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.password-setting-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.password-setting-box {
  width: 478px;
  height: 362px;
  border: 1px solid #DDDDDD;
  border-radius: 15px;
  background: $white;
  position: relative;

  .setting-header {
    display: flex;
    align-items: center;
    padding: 25px 25px 0 25px;
    margin-bottom: 23px;
    position: relative;

    .back-btn {
      position: absolute;
      right: 25px;
      top: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 26px;
      color: $black;
      padding: 0;

      &:hover {
        color: $main-color;
      }
    }

    .setting-title {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
    }
  }

  .input-section {
    padding: 0 25px;

    .input-group {
      margin-bottom: 20px;

      label {
        display: block;
        font-family: $secondary-kr;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.252;
        color: $dark-black;
        margin-bottom: 8px;
      }

      .password-input {
        width: 428px;
        height: 35px;
        border: 1px solid $dark-black;
        border-radius: 10px;
        padding: 0 9px;
        font-family: $secondary-kr;
        font-weight: 300;
        font-size: 14px;
        line-height: 1.252;
        color: $dark-black;

        &::placeholder {
          color: $light-black;
        }

        &:focus {
          outline: none;
          border-color: $main-color;
        }

        &.error {
          border-color: $crimson;
        }
      }
    }

    .password-rules {
      margin-bottom: 20px;

      .rule-item {
        display: flex;
        align-items: center;
        margin-bottom: 4px;

        .bi {
          font-size: 12px;
          margin-right: 7px;
          color: $forestgreen;
        }

        span {
          font-family: $primary-kr;
          font-weight: 450;
          font-size: 14px;
          line-height: 1.2;
          color: $forestgreen;
        }

        .bi:not(.active),
        span:not(.active) {
          color: $dark-gray;
        }
      }
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      justify-content: space-between;

      .current-password-check-btn,
      .save-btn {
        height: 35px;
        border: none;
        border-radius: 15px;
        background: $main-color;
        font-family: $primary-kr;
        font-weight: 700;
        font-size: 16px;
        line-height: 1.2;
        color: $white;
        cursor: pointer;
        padding: 8px 20px;

        &:hover {
          background: $royalblue;
        }
        &:hover:not(:disabled) {
          background: $royalblue;
        }

        &:disabled {
          background: $light-black;
        }
      }

      .current-password-check-btn {
        // 현재 비밀번호 확인 버튼 별도 스타일
      }

      .save-btn {
        // 저장 버튼 별도 스타일
      }
    }

    .error-message {
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

      span {
        line-height: 1.5;
        color: $crimson;
      }
    }
  }
}
</style>