<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="image-section">
          <img 
            src="@/assets/img/웃는마스코트.png" 
            alt="성공 마스코트"
            class="mascot-image"
          />
        </div>
        <div class="message-section">
          <p class="success-message">{{ message }}</p>
        </div>
      </div>
      <!-- Progress Bar -->
      <div v-if="autoClose" class="progress-bar">
        <div
            class="progress-fill"
            :style="{ animationDuration: `${autoCloseDelay}ms` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: '인증이 완료되었습니다.'
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    autoCloseDelay: {
      type: Number,
      default: 3000
    }
  },
  emits: ['close'],
  watch: {
    visible(newVal) {
      if (newVal && this.autoClose) {
        this.scheduleAutoClose()
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    scheduleAutoClose() {
      setTimeout(() => {
        this.closeModal()
      }, this.autoCloseDelay)
    }
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
  display: block;
  z-index: 1000;
}

.modal-container {
  width: 400px;
  height: 300px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  top: 25%;        // 상단에서 20% 지점
  left: 50%;       // 왼쪽에서 50% 지점
  transform: translateX(-50%);
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #f0f0f0;
  z-index: 1;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  animation: progressDecrease linear forwards;
  transform-origin: left;
}

@keyframes progressDecrease {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.image-section {
  height: 191px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.mascot-image {
  width: 170px;
  height: 170px;
  object-fit: cover;
}

.message-section {
  height: 109px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 5px 30px;
}

.success-message {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.252;
  color: #333333;
  text-align: center;
  margin: 0;
}
</style>
