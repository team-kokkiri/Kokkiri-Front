<template>
  <div class="reply-input-form" ref="replyFormRef">
    <form @submit.prevent="handleSubmit" class="reply-form">
      <input
          type="text"
          v-model="replyText"
          placeholder="대댓글을 입력하세요."
          class="input-reply"
          ref="replyInputRef"
      />
      <button type="submit" class="btn-reply-submit">
        <i class="bi bi-vector-pen"></i>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, defineProps, defineEmits } from 'vue'

const props = defineProps({
  commentId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['submit', 'close'])

const replyText = ref('')
const replyFormRef = ref(null)
const replyInputRef = ref(null)

const handleSubmit = () => {
  if (!replyText.value.trim()) return

  emit('submit', {
    commentId: props.commentId,
    content: replyText.value,
    createdAt: new Date().toISOString()
  })

  // 입력창 초기화
  replyText.value = ''
}

// 외부 클릭 시 닫기 - 개선된 버전
const handleClickOutside = (event) => {
  console.log('Click detected, checking if outside...') // 디버깅용
  
  if (replyFormRef.value && 
      replyFormRef.value instanceof HTMLElement &&
      !replyFormRef.value.contains(event.target)) {
    
    // 대댓글 버튼 클릭인지 확인 (대댓글 버튼 클릭 시에는 닫지 않음)
    const isReplyButton = event.target.closest('.btn-reply')
    if (!isReplyButton) {
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
  console.log('ReplyForm mounted') // 디버깅용
  
  // 입력창에 포커스
  nextTick(() => {
    if (replyInputRef.value) {
      replyInputRef.value.focus()
    }
  })

  // 외부 클릭 이벤트 등록 - 약간의 지연을 둬서 현재 클릭과 겹치지 않도록
  setTimeout(() => {
    console.log('Adding click event listener') // 디버깅용
    document.addEventListener('click', handleClickOutside, true) // capture phase 사용
    document.addEventListener('keydown', handleKeyDown)
  }, 100)
})

onUnmounted(() => {
  console.log('ReplyForm unmounted') // 디버깅용
  document.removeEventListener('click', handleClickOutside, true)
  document.removeEventListener('keydown', handleKeyDown)
})

</script>

<style lang="scss" scoped>
.reply-input-form {
  margin: 5px 0 0 36px;
  background-color: #f5f5f5;
  border: 1px solid #dddddd;

  .reply-form {
    display: flex;
    width: 100%;
    height: 40px;

    .input-reply {
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

    .btn-reply-submit {
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