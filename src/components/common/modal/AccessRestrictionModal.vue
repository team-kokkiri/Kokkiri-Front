<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content">
      <div class="mascot-section">
        <img src="@/assets/img/마스코트통제.png" alt="통제 마스코트" class="mascot-image" />
      </div>
      
      <div class="message-section">
        <p class="restriction-text">
          코드를 조회하려면<br>
          오늘 문제를 먼저 해결해야 합니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

/**
 * 모달 오버레이 클릭 시 모달 닫기
 */
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 25vh;
  z-index: 1000;
  cursor: pointer;
}

.modal-content {
  width: 400px;
  height: 300px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: default;
}

.mascot-section {
  height: 191px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  
  .mascot-image {
    width: 170px;
    height: 170px;
    object-fit: contain;
  }
}

.message-section {
  height: 109px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 5px 30px;
  
  .restriction-text {
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 1.252;
    text-align: center;
    color: #333333;
    margin: 0;
    white-space: pre-line;
  }
}
</style>
