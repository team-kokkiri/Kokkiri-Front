<template>
  <div class="hot-board-management">
    <!-- 헤더 -->
    <div class="management-header">
      <div class="header-content">
        <button class="back-btn" @click="handleBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div class="header-title">
          <span>게시판관리</span>
        </div>
      </div>
      <div class="header-line"></div>
    </div>

    <!-- HOT 게시판 섹션 -->
    <div class="hot-board-section">
      <div class="hot-board-header">
        <span class="hot-board-title">HOT 게시판</span>
      </div>
    </div>

    <!-- 좋아요 기준 변경 섹션 -->
    <div class="likes-criteria-section">
      <div class="criteria-content">
        <span>HOT 게시물 선정 기준 변경</span>
        <div class="input-group">
          <input
            type="number"
            v-model.number="newLikesCriteria"
            placeholder="변경할 좋아요 수 입력"
            class="criteria-input"
            min="1"
            max="999"
          />
          <button 
            class="save-btn"
            @click="saveCriteria"
            :disabled="!isValidCriteria"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

// ===== Props =====
const props = defineProps({
  currentCriteria: {
    type: Number,
    default: 10
  }
})

// ===== Emits =====
const emit = defineEmits(['back', 'criteria-updated'])

// ===== 상태 관리 =====
const newLikesCriteria = ref(props.currentCriteria)

// ===== Computed =====
const isValidCriteria = computed(() => {
  return newLikesCriteria.value && 
         newLikesCriteria.value > 0 && 
         newLikesCriteria.value <= 999 &&
         newLikesCriteria.value !== props.currentCriteria
})

// ===== 이벤트 핸들러 =====
function handleBack() {
  emit('back')
}

function saveCriteria() {
  if (!isValidCriteria.value) return
  
  emit('criteria-updated', {
    previousCriteria: props.currentCriteria,
    newCriteria: newLikesCriteria.value
  })
  
  // 성공 메시지 또는 처리 결과를 보여줄 수 있음
  console.log(`HOT 게시물 선정 기준이 ${props.currentCriteria}개에서 ${newLikesCriteria.value}개로 변경되었습니다.`)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.hot-board-management {
  width: 100%;
  height: 100%;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0 0;
  background: $white;
  display: flex;
  flex-direction: column;
}

.management-header {
  .header-content {
    height: 72px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: relative;

    .back-btn {
      width: 26px;
      height: 26px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $dark-black;
      font-size: 18px;
      transition: color 0.2s ease;

      &:hover {
        color: $main-color;
      }
    }

    .header-title {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      span {
        font-family: $secondary-kr;
        font-weight: 500;
        font-size: 18px;
        line-height: 1.252;
        color: $dark-black;
      }
    }
  }

  .header-line {
    width: 100%;
    height: 1px;
    background: $dim-gray;
  }
}

.hot-board-section {
  flex-shrink: 0;
  height: 76px;
  border-bottom: 1px solid $dim-gray;

  .hot-board-header {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 20px;

    .hot-board-title {
      font-family: $secondary-kr;
      font-weight: 700;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
    }
  }
}

.likes-criteria-section {
  height: 76px;
  border-bottom: 1px solid $dim-gray;
  .criteria-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px;

    span {
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
      margin: 0;
    }

    .input-group {
      display: flex;
      align-items: center;
      gap: 20px;

      .criteria-input {
        width: 208px;
        height: 35px;
        border: 1px solid $dark-black;
        border-radius: 10px;
        padding: 0 14px;
        font-family: $secondary-kr;
        font-weight: 300;
        font-size: 14px;
        line-height: 1.252;
        color: $dark-black;
        box-sizing: border-box;

        &::placeholder {
          color: $dim-black;
        }

        &:focus {
          outline: none;
          border-color: $main-color;
        }

        // 숫자 입력 필드 화살표 제거
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        &[type=number] {
          -moz-appearance: textfield;
        }
      }

      .save-btn {
        width: 65px;
        height: 36px;
        background: $main-color;
        border: none;
        border-radius: 15px;
        font-family: $primary-kr;
        font-weight: 700;
        font-size: 16px;
        line-height: 1.2;
        color: $white;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: darken($main-color, 10%);
        }

        &:active:not(:disabled) {
          transform: translateY(1px);
        }

        &:disabled {
          background: $light-gray;
          color: $silver-black;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>