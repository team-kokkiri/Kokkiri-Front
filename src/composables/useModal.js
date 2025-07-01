import { ref } from 'vue'

// Loading Modal State
const loadingModalState = ref({
  visible: false,
  message: '인증 메일을 발송중입니다',
  subMessage: '잠시만 기다려주세요!'
})

export function useSuccessModal() {
  // 각 컴포넌트마다 독립적인 상태를 생성
  const successModalState = ref({
    visible: false,
    message: '인증이 완료되었습니다.',
    autoClose: true,
    autoCloseDelay: 3000
  })

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

export function useDeleteConfirmModal() {
  // 각 컴포넌트마다 독립적인 상태를 생성
  const deleteModalState = ref({
    visible: false,
    message: '정말 삭제하시겠습니까?'
  })

  const showDeleteModal = (options = {}) => {
    deleteModalState.value = {
      visible: true,
      message: options.message || '정말 삭제하시겠습니까?'
    }
  }

  const hideDeleteModal = () => {
    deleteModalState.value.visible = false
  }

  return {
    deleteModalState,
    showDeleteModal,
    hideDeleteModal
  }
}
