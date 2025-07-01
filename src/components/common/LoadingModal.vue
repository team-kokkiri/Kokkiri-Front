<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="image-section">
          <img 
            src="@/assets/img/마스코트인증메일.png"
            alt="발송 중 마스코트"
            class="mascot-image"
          />
        </div>
        <div class="message-section">
          <p class="sending-message">
            인증 메일을 발송중입니다<span class="dots">
              <span class="dot">. </span>
              <span class="dot">. </span>
              <span class="dot">. </span>
            </span>
          </p>
          <br>
          <p class="sub-message">잠시만 기다려주세요!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: '인증 메일을 발송중입니다'
    },
    subMessage: {
      type: String,
      default: '잠시만 기다려주세요!'
    }
  },
  emits: ['close'],
  methods: {
    closeModal() {
      // 로딩 중일 때는 클릭으로 닫기 비활성화
      // this.$emit('close')
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
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 25vh;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 5px 30px;
  text-align: center;
}

.sending-message {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 0.75;
  color: #333333;
  margin: 0 0 8px 0;
}

.sub-message {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 0.75;
  color: #777777;
  margin: 0;
}

.dots {
  display: inline-block;
}

.dot {
  opacity: 0;
  animation: dotBlink 1.5s infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.5s;
}

.dot:nth-child(3) {
  animation-delay: 1s;
}

@keyframes dotBlink {
  0%, 20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
