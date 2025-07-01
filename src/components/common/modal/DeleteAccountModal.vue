<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="image-section">
          <img 
            src="../../../assets/img/마스코트탈퇴.png"
            alt="회원탈퇴 마스코트"
            class="mascot-image"
          />
        </div>
        <div class="message-section">
          <p class="delete-message">정말 탈퇴하시겠습니까?</p>
        </div>
        <div class="button-section">
          <button class="btn-confirm" @click="confirmDelete">네</button>
          <button class="btn-cancel" @click="cancelDelete">아니오</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteAccountModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel', 'close'],
  methods: {
    confirmDelete() {
      this.$emit('confirm')
    },
    cancelDelete() {
      this.$emit('cancel')
    },
    closeModal() {
      this.$emit('close')
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
  height: 170px;
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
  height: 47px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.delete-message {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.252;
  color: #333333;
  text-align: center;
  margin: 0;
}

.button-section {
  height: 83px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 34px;
  padding: 20px;
}

.btn-confirm,
.btn-cancel {
  width: 100px;
  padding: 8px 15px;
  background: #2196F3;
  color: #FFFFFF;
  border: none;
  border-radius: 15px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.252;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
}
</style>
