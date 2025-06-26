<template>
  <div class="post-edit-form">
    <!-- 섹션 타이틀 -->
    <div class="section-title">
      <h2 class="board-title">자유게시판</h2>
    </div>

    <!-- 수정 폼 -->
    <form class="edit-form" @submit.prevent="handleSubmit">
      <!-- 제목 입력 -->
      <div class="form-title">
        <input 
          type="text" 
          class="input-title" 
          placeholder="제목을 입력하세요"
          v-model="formData.boardTitle"
          required
        />
      </div>

      <!-- 내용 입력 -->
      <div class="form-body">
        <textarea 
          class="input-body" 
          placeholder="내용을 입력하세요!"
          v-model="formData.boardContent"
          required
        ></textarea>
      </div>

      <!-- 푸터 (버튼들) -->
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
          <button type="submit" class="btn-submit">
            <i class="bi bi-vector-pen"></i>
          </button>
        </div>
      </div>
    </form>

    <!-- 하단 취소 버튼 -->
    <div class="edit-footer">
      <button class="btn-cancel" @click="handleCancel">
        <i class="bi bi-chevron-left"></i>
        <span class="text">글 수정 취소</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// 폼 데이터
const formData = ref({
  boardTitle: '',
  boardContent: '',
  questionYn: false,
  attachedImages: []
})

// 파일 입력 참조
const fileInputRef = ref(null)

// 컴포넌트 마운트시 기존 게시글 데이터로 폼 초기화
onMounted(() => {
  if (props.post) {
    formData.value = {
      boardTitle: props.post.boardTitle || '',
      boardContent: props.post.boardContent || '',
      questionYn: props.post.questionYn || false,
      attachedImages: []
    }
  }
})

// 폼 제출 처리
function handleSubmit() {
  if (!formData.value.boardTitle.trim() || !formData.value.boardContent.trim()) {
    alert('제목과 내용을 입력해주세요.')
    return
  }

  // 부모 컴포넌트로 수정된 데이터 전달
  emit('submit', {
    id: props.post.id,
    boardTitle: formData.value.boardTitle,
    boardContent: formData.value.boardContent,
    questionYn: formData.value.questionYn,
    attachedImages: formData.value.attachedImages
  })
}

// 취소 처리
function handleCancel() {
  emit('cancel')
}

// 이미지 업로드 처리
function handleImageUpload() {
  fileInputRef.value?.click()
}

function onFileChange(event) {
  const files = event.target.files
  if (files && files.length > 0) {
    formData.value.attachedImages = Array.from(files)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.post-edit-form {
  width: 832px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  .section-title {
    width: 100%;
    height: 60px;
    border: 1px solid #dddddd;
    display: flex;
    align-items: center;

    .board-title {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 22px;
      font-weight: 500;
      color: #333333;
      line-height: 1.2;
      margin: 0;
      padding: 0 15px;
    }
  }

  .edit-form {
    width: 100%;
    height: 470px;
    border: 2px solid #dddddd;
    background: #ffffff;
    display: flex;
    flex-direction: column;

    .form-title {
      height: 50px;
      padding: 0 15px;
      border-bottom: 1px solid #dddddd;
      display: flex;
      align-items: center;

      .input-title {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #686868;
        outline: none;

        &::placeholder {
          color: #686868;
          text-align: center;
        }
      }
    }

    .form-body {
      flex: 1;
      padding: 15px;
      border-bottom: 1px solid #dddddd;

      .input-body {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
        resize: none;
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 14px;
        font-weight: 350;
        color: #686868;
        line-height: 1.2;
        outline: none;

        &::placeholder {
          color: #686868;
        }
      }
    }

    .form-footer {
      height: 40px;
      padding-left: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #dddddd;

      .form-actions-left {
        .btn-upload-image {
          width: 20px;
          height: 20px;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;

          .bi-image {
            font-size: 20px;
            color: #777777;
          }

          &:hover {
            opacity: 0.7;
          }
        }
      }

      .form-actions-right {
        display: flex;
        align-items: center;
        gap: 15px;

        .checkbox-wrap {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 1px 16px 1px 0;
          border: 1px solid #bdbdbd;
          border-radius: 5px;
          height: 16px;

          input[type="checkbox"] {
            width: 16px;
            height: 16px;
            margin: 0;
            accent-color: #bdbdbd;
          }

          .label-text {
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 12px;
            font-weight: 400;
            color: #777777;
            margin-left: 16px;
            line-height: 1.2;
          }
        }

        .btn-submit {
          width: 40px;
          height: 40px;
          background: #2196f3;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;

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

  .edit-footer {
    .btn-cancel {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 15px;
      background-color: #ffffff;
      border: 1px solid #fd5631;
      border-radius: 5px;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #fd5631;
      cursor: pointer;
      transition: all 0.2s ease;
      height: 35px;

      .bi-chevron-left {
        font-size: 16px;
        color: #fd5631;
      }

      .text {
        line-height: 1.2;
        font-size: 14px;
        color: #fd5631;
      }

      &:hover {
        background-color: #fd5631;
        color: #ffffff;

        .bi-chevron-left, .text {
          color: #ffffff;
        }
      }
    }
  }
}
</style>