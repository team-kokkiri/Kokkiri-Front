import { ref } from 'vue'

const modalState = ref({
  visible: false,
  message: '인증이 완료되었습니다.',
  autoClose: true,
  autoCloseDelay: 3000
})

export function useSuccessModal() {
  const showModal = (options = {}) => {
    modalState.value = {
      visible: true,
      message: options.message || '인증이 완료되었습니다.',
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      autoCloseDelay: options.autoCloseDelay || 3000
    }
  }

  const hideModal = () => {
    modalState.value.visible = false
  }

  return {
    modalState,
    showModal,
    hideModal
  }
}
