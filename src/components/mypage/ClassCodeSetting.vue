<template>
  <div class="class-code-setting-wrap">
    <div class="class-code-setting-box">
      <div class="setting-header">
        <button
            class="back-btn"
            @click="$emit('back')"
        >
          <i class="bi bi-arrow-left"></i>
        </button>
        <span class="setting-title">반 코드 변경</span>
      </div>

      <div class="input-section">
        <!-- 반 코드 입력 -->
        <div class="input-group">
          <input
              type="text"
              id="class-code"
              v-model="classCode"
              placeholder="반 코드 입력"
              class="class-code-input"
              :class="{ error: !!errorMessage }"
              @input="resetValidation"
          />
        </div>

        <div class="button-group">
          <button
              class="verify-btn"
              @click="verifyClassCode"
              :disabled="!classCode.trim()"
          >
            확인
          </button>
          <button
              class="save-btn"
              @click="saveClassCode"
              :disabled="!isVerified || !classCode.trim()"
          >
            저장
          </button>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="error-message">
          <i class="bi bi-x-lg"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- 성공 메시지 -->
        <div v-if="successMessage" class="success-message">
          <i class="bi bi-check-lg"></i>
          <span>{{ successMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineExpose, ref, watch } from 'vue'

const emit = defineEmits(['back', 'save', 'verify-class-code'])

// 반응형 데이터
const classCode = ref('') // 입력된 반 코드
const isVerified = ref(false) // 반 코드 확인 여부
const errorMessage = ref('') // 에러 메시지
const successMessage = ref('') // 성공 메시지

/**
 * 입력값 변경 시 검증 상태 초기화
 */
watch(classCode, () => {
  resetValidation()
})

/**
 * 검증 상태 초기화
 */
const resetValidation = () => {
  isVerified.value = false
  errorMessage.value = ''
  successMessage.value = ''
}

/**
 * 반 코드 확인 요청
 */
const verifyClassCode = () => {
  if (!classCode.value.trim()) return

  emit('verify-class-code', classCode.value.trim())
}

/**
 * 반 코드 저장 요청
 */
const saveClassCode = () => {
  if (!classCode.value.trim()) {
    errorMessage.value = '반 코드를 입력해주세요.'
    return
  }

  if (!isVerified.value) {
    errorMessage.value = '반 코드를 먼저 확인해주세요.'
    return
  }

  emit('save', classCode.value.trim())
}

/**
 * 부모 컴포넌트에서 반 코드 확인 결과를 받아 처리하는 함수
 * @param {boolean} result - 반 코드 확인 결과
 * @param {string} message - 결과 메시지
 */
const setVerificationResult = (result, message = '') => {
  isVerified.value = result

  if (result) {
    errorMessage.value = ''
    successMessage.value = message || '유효한 반 코드입니다.'
  } else {
    successMessage.value = ''
    errorMessage.value = message || '존재하지 않는 반 코드입니다.'
  }
}

/**
 * 저장 완료 후 메시지 표시
 * @param {string} message - 성공 메시지
 */
const setSaveResult = (message = '반 코드가 성공적으로 변경되었습니다.') => {
  errorMessage.value = ''
  successMessage.value = message
}

/**
 * 에러 메시지 설정
 * @param {string} message - 에러 메시지
 */
const setErrorMessage = (message) => {
  errorMessage.value = message
  successMessage.value = ''
  isVerified.value = false
}

// 부모에서 호출할 수 있도록 expose
defineExpose({
  setVerificationResult,
  setSaveResult,
  setErrorMessage
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.class-code-setting-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.class-code-setting-box {
  width: 478px;
  height: 213px;
  border: 1px solid #DDDDDD;
  border-radius: 15px;
  background: $white;
  position: relative;

  .setting-header {
    display: flex;
    align-items: center;
    padding: 25px 25px 0 25px;
    margin-bottom: 25px;
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
      margin-bottom: 25px;

      label {
        display: block;
        font-family: $secondary-kr;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.252;
        color: $dark-black;
        margin-bottom: 8px;
      }

      .class-code-input {
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

    .button-group {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;

      .verify-btn,
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

        &:hover:not(:disabled) {
          background: $royalblue;
        }

        &:disabled {
          background: $light-black;
        }
      }

      .verify-btn {
        // 확인 버튼 별도 스타일
      }

      .save-btn {
        // 저장 버튼 별도 스타일
      }
    }

    .error-message,
    .success-message {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-left: 2px;
      font-weight: 430;

      .bi {
        font-size: 14px;
        margin-right: 5px;
      }

      span {
        line-height: 1.5;
      }
    }

    .error-message {
      .bi {
        color: $crimson;
      }

      span {
        color: $crimson;
      }
    }

    .success-message {
      .bi {
        color: $forestgreen;
      }

      span {
        color: $forestgreen;
      }
    }
  }
}
</style>