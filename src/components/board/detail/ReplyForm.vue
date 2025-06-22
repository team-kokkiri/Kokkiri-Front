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

// 외부 클릭 시 닫기
const handleClickOutside = (event) => {
  if (replyFormRef.value &&
      replyFormRef.value instanceof HTMLElement &&
      !replyFormRef.value.contains(event.target)) {
    emit('close')
  }
}

onMounted(() => {
  // 입력창에 포커스
  nextTick(() => {
    if (replyInputRef.value) {
      replyInputRef.value.focus()
    }
  })

  // 외부 클릭 이벤트 등록
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.reply-input-form {
  margin: 15px 0 15px 36px;
  background-color: #f5f5f5;
  border: 1px solid #dddddd;
  border-radius: 5px;

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
      border-radius: 0 5px 5px 0;

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