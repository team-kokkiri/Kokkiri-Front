import { ref } from 'vue'

// Success Modal State
const successModalState = ref({
  visible: false,
  message: '인증이 완료되었습니다.',
  autoClose: true,
  autoCloseDelay: 3000
})

// Loading Modal State
const loadingModalState = ref({
  visible: false,
  message: '인증 메일을 발송중입니다',
  subMessage: '잠시만 기다려주세요!'
})

export function useSuccessModal() {
  const showModal = (options = {}) => {
    successModalState.value = {
      visible: true,
      message: options.message || '인증이 완료되었습니다.',
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      autoCloseDelay: options.autoCloseDelay || 3000
    }
  }

  const hideModal = () => {
    successModalState.value.visible = false
  }

  return {
    modalState: successModalState,
    showModal,
    hideModal
  }
}

export function useLoadingModal() {
  const showLoadingModal = (options = {}) => {
    loadingModalState.value = {
      visible: true,
      message: options.message || '인증 메일을 발송중입니다',
      subMessage: options.subMessage || '잠시만 기다려주세요!'
    }
  }

  const hideLoadingModal = () => {
    loadingModalState.value.visible = false
  }

  return {
    loadingModalState,
    showLoadingModal,
    hideLoadingModal
  }
}
