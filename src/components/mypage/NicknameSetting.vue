<template>
  <div class="nickname-setting-wrap">
    <div class="nickname-setting-box">
      <div class="setting-header">
        <button
            class="back-btn"
            @click="$emit('back')"
        >
          <i class="bi bi-arrow-left"></i>
        </button>
        <span class="setting-title">닉네임 설정</span>
      </div>

      <div class="input-section">
        <div class="input-group">
          <input
              type="text"
              v-model="nickname"
              placeholder="변경할 닉네임  입력"
              class="nickname-input"
              @input="resetValidation"
          />
        </div>

        <div class="button-group">
          <button
              class="duplicate-check-btn"
              @click="checkDuplicate"
              :disabled="!nickname.trim()"
          >
            중복확인
          </button>
          <button
              class="save-btn"
              @click="saveNickname"
              :disabled="!isValidated || !nickname.trim()"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineExpose, ref } from 'vue'

const emit = defineEmits(['back', 'save', 'duplicate-check'])

// 반응형 데이터
const nickname = ref('') // 입력된 닉네임
const isValidated = ref(false) // 중복확인 완료 여부

/**
 * 입력값 변경 시 중복확인 상태 초기화
 */
const resetValidation = () => {
  isValidated.value = false
}

/**
 * 닉네임 중복확인 요청
 * 입력된 닉네임을 부모 컴포넌트로 전달하여 중복확인 처리
 */
const checkDuplicate = () => {
  if (!nickname.value.trim()) return

  emit('duplicate-check', nickname.value.trim())
  // 부모 컴포넌트에서 결과에 따라 isValidated 값 설정
}

/**
 * 닉네임 저장 요청
 * 유효성 검사 후 닉네임을 부모 컴포넌트로 전달
 */
const saveNickname = () => {
  if (!nickname.value.trim() || !isValidated.value) return

  emit('save', nickname.value.trim())
}

/**
 * 부모 컴포넌트에서 중복확인 결과를 받아 처리하는 함수
 * @param {boolean} result - 중복확인 결과 (true: 사용가능, false: 중복됨)
 */
const setValidationResult = (result) => {
  isValidated.value = result
}

// 부모에서 호출할 수 있도록 expose
defineExpose({
  setValidationResult
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.nickname-setting-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.nickname-setting-box {
  width: 478px;
  height: 198px;
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
      margin-bottom: 25px;

      .nickname-input {
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
      }
    }

    .button-group {
      display: flex;
      gap: 12px;

      .duplicate-check-btn,
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

      .duplicate-check-btn {
        // 중복확인 버튼 별도 스타일이 필요하면 여기에
      }

      .save-btn {
        // 저장 버튼 별도 스타일이 필요하면 여기에
      }
    }
  }
}
</style>