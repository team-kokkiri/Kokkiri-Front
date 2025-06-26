<template>
  <div class="password-setting-wrap">
    <div class="password-setting-box">
      <div class="setting-header">
        <button class="back-btn" @click="$emit('back')">
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

        <!-- 재확인 비밀번호 -->
        <div class="input-group">
          <label for="new-password">재확인 비밀번호</label>
          <input
              type="password"
              id="new-password"
              v-model="confirmPassword"
              placeholder="재확인 비밀번호 입력"
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
              class="save-btn"
              @click="savePassword"
              :disabled="!isNewPasswordValid"
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
import {ref, computed, watch, defineEmits} from 'vue'
import axios from '../../utils/axios'

const emit = defineEmits(['back', 'save', 'duplicate-check'])

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const currentPasswordError = ref('')

watch([currentPassword, newPassword], () => {
  currentPasswordError.value = ''
})

const resetCurrentPasswordError = () => {
  currentPasswordError.value = ''
}

const resetValidation = () => {
  // validation 상태 초기화 (추후 확장 가능)
}

// 비밀번호 조건 체크
const isPasswordMixed = computed(() => {
  const pwd = newPassword.value
  let types = 0
  if (/[A-Za-z]/.test(pwd)) types++
  if (/[0-9]/.test(pwd)) types++
  if (/[^A-Za-z0-9]/.test(pwd)) types++
  return types >= 2
})

const isPasswordLengthValid = computed(() => {
  const pwd = newPassword.value
  return pwd.length >= 8 && pwd.length <= 32 && !/\s/.test(pwd)
})

const isPasswordNoRepeat = computed(() => {
  const pwd = newPassword.value
  if (pwd.length < 8) return false
  return !/(.)\1\1/.test(pwd)
})

const isNewPasswordValid = computed(() => {
  return isPasswordMixed.value && isPasswordLengthValid.value && isPasswordNoRepeat.value
})

// 저장 API 호출
const savePassword = async () => {
  if (!currentPassword.value.trim()) {
    currentPasswordError.value = '현재 비밀번호를 입력해주세요.'
    return
  }

  if (!newPassword.value.trim()) {
    currentPasswordError.value = '새 비밀번호를 입력해주세요.'
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

  try {
    await axios.put('/api/members/password', {
      currentPassword: currentPassword.value.trim(),
      newPassword: newPassword.value.trim()
    })

    alert('비밀번호가 성공적으로 변경되었습니다.')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    emit('save')
    // router.push('/mypage')
  } catch (error) {
    currentPasswordError.value =
        error.response?.data?.message || '비밀번호 변경에 실패했습니다.'
    console.error(error)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';
.password-input.error {
  border-color: #dc3545;
}

.check-result {
  margin-top: 4px;
  font-size: 13px;
}

.check-result .success {
  color: #28a745;
}

.check-result .fail {
  color: #dc3545;
}

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