<template>
  <div class="edit-input-form" ref="editFormRef">
    <form @submit.prevent="handleSubmit" class="edit-form">
      <input
          type="text"
          v-model="editText"
          placeholder="수정할 내용을 입력하세요."
          class="input-edit"
          ref="editInputRef"
      />
      <button type="submit" class="btn-edit-submit">
        <i class="bi bi-vector-pen"></i>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, defineProps, defineEmits } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  itemType: {
    type: String,
    required: true, // 'post', 'comment', 'reply'
    validator: (value) => ['post', 'comment', 'reply'].includes(value)
  }
})

const emit = defineEmits(['submit', 'close'])

const editText = ref('')
const editFormRef = ref(null)
const editInputRef = ref(null)

const handleSubmit = () => {
  if (!editText.value.trim()) return

  emit('submit', {
    id: props.item.id,
    content: editText.value,
    itemType: props.itemType,
    updatedAt: new Date().toISOString()
  })

  // 입력창 초기화
  editText.value = ''
}

// 외부 클릭 시 닫기
const handleClickOutside = (event) => {
  console.log('Click detected, checking if outside...') // 디버깅용

  if (editFormRef.value &&
      editFormRef.value instanceof HTMLElement &&
      !editFormRef.value.contains(event.target)) {

    // 수정 버튼 클릭인지 확인 (수정 버튼 클릭 시에는 닫지 않음)
    const isEditButton = event.target.closest('.btn-edit')
    if (!isEditButton) {
      console.log('Emitting close event...') // 디버깅용
      emit('close')
    }
  }
}

// ESC 키로도 닫기 가능하도록 추가
const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    console.log('ESC key pressed, closing...') // 디버깅용
    emit('close')
  }
}

onMounted(() => {
  console.log('EditForm mounted') // 디버깅용

  // 입력창에 포커스
  nextTick(() => {
    if (editInputRef.value) {
      editInputRef.value.focus()
    }
  })

  // 외부 클릭 이벤트 등록 - 약간의 지연을 둬서 현재 클릭과 겹치지 않도록
  setTimeout(() => {
    console.log('Adding click event listener') // 디버깅용
    document.addEventListener('click', handleClickOutside, true) // capture phase 사용
    document.addEventListener('keydown', handleKeyDown)
  }, 100)
})

// 메모리 최적화
onUnmounted(() => {
  console.log('EditForm unmounted') // 디버깅용
  document.removeEventListener('click', handleClickOutside, true)
  document.removeEventListener('keydown', handleKeyDown)
})

</script>

<style lang="scss" scoped>
.edit-input-form {
  margin: 5px 0 5px 36px;
  background-color: #f5f5f5;
  border: 1px solid #dddddd;

  .edit-form {
    display: flex;
    width: 100%;
    height: 40px;

    .input-edit {
      flex: 1;
      padding: 12px 15px;
      border: none;
      background: transparent;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 13px;
      font-weight: 350;
      color: #686868;
      outline: none;
      line-height: 1.2;

      &::placeholder {
        color: #686868;
      }
    }

    .btn-edit-submit {
      width: 40px;
      height: 40px;
      background-color: #2196f3;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        color: #ffffff;
        font-size: 16px;
      }

      &:hover {
        background-color: #1976d2;
      }
    }
  }
}
</style>