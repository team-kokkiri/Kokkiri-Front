<template>
  <div class="board-free-write">
    <!-- 글쓰기 토글 -->
    <div class="board-free-write-toggle" v-if="!showWriteForm">
      <input
          type="text"
          class="write-placeholder"
          placeholder="새 글을 작성해주세요!"
          @focus="showWriteForm = true"
      />
      <i class="bi bi-vector-pen"></i>
    </div>

    <!-- 글쓰기 폼 -->
    <form
        ref="formRef"
        class="board-free-form"
        v-if="showWriteForm"
        @submit.prevent="handleSubmit"
        @focusin="onFormFocus"
        @focusout="onFormBlur"
        tabindex="0"
    >
      <div class="form-title">
        <input 
            type="text" 
            class="input-title" 
            placeholder="제목을 입력하세요"
            v-model="formData.boardTitle"
        />
      </div>
      <div class="form-body">
        <textarea 
            class="input-body" 
            placeholder="내용을 입력하세요"
            v-model="formData.boardContent"
        ></textarea>
      </div>
      <div class="form-footer">
        <div class="form-actions-left">
          <button type="button" class="btn-upload-image" @click="handleImageUpload">
            <i class="bi bi-image"></i>
          </button>
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="image/*"
            style="display: none"
            @change="onFileChange"
          />
        </div>
        <div class="form-actions-right">
          <label class="checkbox-wrap">
            <input 
                type="checkbox" 
                v-model="formData.questionYn"
            />
            <span class="label-text">질문</span>
          </label>
          <button type="submit" class="btn-submit">
            <i class="bi bi-vector-pen"></i>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'

// Props
defineProps({
  // 필요시 부모에서 초기값 받을 수 있음
})

// Emits
const emit = defineEmits(['submit', 'imageUpload'])

// 글쓰기 폼 show/hide 여부
const showWriteForm = ref(false)

// 폼 데이터
const formData = ref({
  boardTitle: '',
  boardContent: '',
  questionYn: false,
  attachedImages: []
})

// 글쓰기 폼 dom 참조
const formRef = ref(null)

// 폼이 포커스 됐는지 체크 (폼 안에서 클릭·포커스 이동시 안 사라지게)
let formFocusTimer = null

// 글쓰기 폼 포커스 처리
function onFormFocus() {
  clearTimeout(formFocusTimer)
}

// 글쓰기 폼 포커스 아웃 처리 (짧은 delay 후 숨김)
function onFormBlur() {
  formFocusTimer = setTimeout(() => {
    showWriteForm.value = false
  }, 80)
}

// 글쓰기 폼 제출
function handleSubmit() {
  if (!formData.value.boardTitle.trim() || !formData.value.boardContent.trim()) {
    alert('제목과 내용을 입력해주세요.')
    return
  }
  // 부모 컴포넌트로 데이터 전달
emit('submit', {
  boardTitle: formData.value.boardTitle,
  boardContent: formData.value.boardContent,
  questionYn: formData.value.questionYn,
  attachedImages: formData.value.attachedImages // 이건 File[] 타입이어야 함
})
  
  // 폼 초기화
  formData.value = {
    boardTitle: '',
    boardContent: '',
    questionYn: false,
    attachedImages: []
  }
  showWriteForm.value = false
}

// 이미지 업로드 처리
// function handleImageUpload() {
//   emit('imageUpload')
// }

// 이미지 업로드 처리
const fileInputRef = ref(null)

function handleImageUpload() {
  fileInputRef.value?.click()
}

function onFileChange(event) {
  const files = event.target.files
  if (files && files.length > 0) {
    formData.value.attachedImages = Array.from(files)
  }
}


// 클릭된 요소가 form 내부이거나 file input이거나,
// 또는 file input을 연 원래 버튼(.btn-upload-image)을 포함하는 경우에는 닫지 않음
function handleClickOutside(e) {
  const formEl = formRef.value
  const fileInputEl = fileInputRef.value

  if (
    formEl?.contains(e.target) ||
    fileInputEl?.contains(e.target) ||
    e.target.closest('.btn-upload-image')
  ) {
    return
  }
  showWriteForm.value = false
}

// 폼 바깥 클릭 이벤트 등록/해제
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';
.board-free-write {
  margin-bottom: 5px;

  .board-free-write-toggle {
    display: flex;
    align-items: center;
    border: 2px solid $dim-gray;
    height: 60px;
    padding: 0 10px;
    background: $cloudy-gray;

    .write-placeholder {
      flex: 1 1 0;
      border: none;
      font-size: 14px;
      background: $cloudy-gray;
      font-weight: 400;
      outline: none;

      &::placeholder {
        color: #adb5bd;
      }
    }

    .bi-vector-pen {
      font-size: 22px;
      color: #777777;
      margin-left: 15px;
    }
  }

  .board-free-form {
    position: relative;
    border: 2px solid $dim-gray;
    background: #fff;
    box-sizing: border-box;

    .form-title {
      padding: 15px;
      border-bottom: 1px solid $dim-gray;
      background: $cloudy-gray;

      .input-title {
        width: 100%;
        border: none;
        background: transparent;
        font-size: 16px;
        font-weight: bold;
        color: $dim-black;
        outline: none;
        letter-spacing: -0.5px;

        &::placeholder {
          font-size: 16px;
          color: $silver-black;
        }
      }
    }

    .form-body {
      background: #fff;

      .input-body {
        width: 100%;
        height: 380px;
        padding: 15px;
        border: none;
        background: transparent;
        resize: vertical;
        font-size: 14px;
        line-height: 1.6;
        letter-spacing: -0.3px;
        outline: none;
        margin-bottom: 6px;
        font-family: inherit;

        &::placeholder {
          color: #adb5bd;
        }
      }
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 40px;
      border-top: 1px solid $dim-gray;

      .form-actions-left {
        display: flex;
        gap: 8px;

        .btn-upload-image {
          display: flex;
          align-items: center;
          height: 40px;
          width: 40px;
          border: none;
          background: none;
          padding: 10px;
          cursor: pointer;

          .bi-image {
            font-size: 20px;
            color: $silver-black;
          }

          &:hover {
            background: #f8f9fa;
          }
        }
      }

      .form-actions-right {
        display: flex;
        align-items: center;

        .checkbox-wrap {
          height: 40px;
          display: flex;
          align-items: center;
          cursor: pointer;

          input[type="checkbox"] {
            accent-color: #555;
            width: 15px;
            height: 15px;
            margin-right: 5px;
            margin-top: 5px;
          }

          .label-text {
            font-size: 12px;
            color: $silver-black;
            font-weight: 500;
          }
        }

        .btn-submit {
          width: 40px;
          height: 40px;
          background: $main-color;
          cursor: pointer;
          border: none;
          margin-left: 15px;

          &:hover {
            opacity: 0.9;
          }

          .bi-vector-pen {
            color: white;
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
