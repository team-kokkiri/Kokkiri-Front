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
        tabindex="0"
    >
      <div class="form-title">
        <input
            type="text"
            class="input-title"
            placeholder="제목을 입력하세요"
            v-model="formData.boardTitle"
        />
        <button
            type="button"
            class="btn-close"
            @click="showWriteForm = false"
            aria-label="닫기"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="form-body">
        <textarea
            class="input-body"
            placeholder="내용을 입력하세요"
            v-model="formData.boardContent"
        ></textarea>
      </div>

      <!-- 파일/이미지 미리보기 -->
      <div v-if="formData.attachedImages && formData.attachedImages.length > 0" class="image-preview-container">
        <div
            v-for="(file, index) in formData.attachedImages"
            :key="index"
            class="image-preview-item"
            @click="removeImage(index)"
        >
          <!-- 이미지인 경우 썸네일 -->
          <img
              v-if="file.type && file.type.startsWith('image/')"
              :src="getImagePreviewUrl(file)"
              alt="미리보기"
              class="preview-image"
          />
          <!-- 파일인 경우 아이콘+파일명 -->
          <div v-else class="file-icon">
            <i class="bi bi-file-earmark"></i>
            <span class="file-name">{{ file.name }}</span>
          </div>
        </div>
        <div class="image-add-item" @click="handleImageUpload">
          <img src="@/assets/img/imgPlus.jpg" alt="파일 추가" class="add-image-icon" />
        </div>
      </div>

      <div class="form-footer">
        <div class="form-actions-left">
          <img src="@/assets/img/attach.png" alt="" @click="handleImageUpload">
          <input
              ref="fileInputRef"
              type="file"
              multiple
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

    <!-- 글 작성 확인 모달 -->
    <WriteConfirmModal
        :visible="showWriteConfirmModal"
        @confirm="confirmWrite"
        @cancel="cancelWrite"
        @close="closeWriteModal"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import WriteConfirmModal from '@/components/common/modal/WriteConfirmModal.vue'

// Props
const props = defineProps({
  boardTypeId: { type: Number, required: true }
})

// Emits
const emit = defineEmits(['submit', 'imageUpload'])

const showWriteForm = ref(false)
const showWriteConfirmModal = ref(false)
const formRef = ref(null)
const fileInputRef = ref(null)

const formData = ref({
  boardTitle: '',
  boardContent: '',
  questionYn: false,
  attachedImages: []
})

// 폼 제출
function handleSubmit() {
  if (!formData.value.boardTitle.trim() || !formData.value.boardContent.trim()) {
    alert('제목과 내용을 입력해주세요.')
    return
  }
  showWriteConfirmModal.value = true
}

// 글 작성 확정
function confirmWrite() {
  if (props.boardTypeId === 5) {
    const hasImage = formData.value.attachedImages.some(file =>
        file.type && file.type.startsWith('image/')
    )
    if (!hasImage) {
      alert('프로젝트 소개 게시판은 이미지 1개 이상 첨부해야 합니다.')
      return
    }
  }
  emit('submit', {
    boardTitle: formData.value.boardTitle,
    boardContent: formData.value.boardContent,
    questionYn: formData.value.questionYn,
    attachedImages: formData.value.attachedImages
  })
  resetForm()
}

function resetForm() {
  formData.value = {
    boardTitle: '',
    boardContent: '',
    questionYn: false,
    attachedImages: []
  }
  showWriteForm.value = false
  showWriteConfirmModal.value = false
}
function cancelWrite() {
  showWriteConfirmModal.value = false
}
function closeWriteModal() {
  showWriteConfirmModal.value = false
}

// 파일 업로드
function handleImageUpload() {
  fileInputRef.value?.click()
}

function onFileChange(event) {
  const files = Array.from(event.target.files)
  if (!files.length) return

  // 허용 타입 정의
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
  const allowedFileTypes = [
    'application/pdf', 'application/vnd.hancom.hwp', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv', 'application/zip'
  ]
  let filteredFiles = []

  if (props.boardTypeId === 1) {
    filteredFiles = files.filter(file => allowedImageTypes.includes(file.type))
    if (filteredFiles.length === 0) {
      alert('이미지만 첨부할 수 있습니다.')
      return
    }
  } else {
    filteredFiles = files.filter(file =>
        allowedImageTypes.includes(file.type) || allowedFileTypes.includes(file.type)
    )
    if (filteredFiles.length === 0) {
      alert('첨부 가능한 파일만 업로드할 수 있습니다.')
      return
    }
  }
  formData.value.attachedImages = [...formData.value.attachedImages, ...filteredFiles]
  event.target.value = ''
}

// 미리보기 URL
function getImagePreviewUrl(file) {
  return URL.createObjectURL(file)
}

// 첨부파일 삭제
function removeImage(index) {
  formData.value.attachedImages.splice(index, 1)
}
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
      background: $white;
      display: flex;

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
      .btn-close {
        background: white;
        border: none;
        font-size: 20px;
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

        img {
          height: 40px;
          width: 40px;
          cursor: pointer;
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

    // 파일/이미지 미리보기
    .image-preview-container {
      height: 121px;
      border-top: 1px solid $dim-gray;
      padding: 16px;
      display: flex;
      gap: 4px;
      align-items: center;
      overflow-x: auto;
      background: #fff;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }

      .image-preview-item {
        position: relative;
        width: 85px;
        height: 85px;
        flex-shrink: 0;
        border: 1px solid $dim-gray;
        border-radius: 4px;
        overflow: hidden;

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .file-icon {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;

          .bi-file-earmark {
            font-size: 30px;
            color: #6c757d;
            margin-bottom: 4px;
          }
          .file-name {
            font-size: 10px;
            color: #495057;
            text-align: center;
            word-break: break-all;
            padding: 0 4px;
            max-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }

      .image-add-item {
        width: 85px;
        height: 85px;
        flex-shrink: 0;
        border: 1px solid $dim-gray;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: #f8f9fa;

        &:hover {
          background: #e9ecef;
        }
        .add-image-icon {
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
