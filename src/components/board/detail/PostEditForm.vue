<template>
  <div class="post-edit-form">
    <!-- 섹션 타이틀 -->
    <div class="section-title">
      <h2 class="board-title">{{ getBoardTypeName() }}</h2>
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
      
      <!-- 파일 미리보기창 -->
      <div v-if="(existingImages && existingImages.length > 0) || (formData.attachedImages && formData.attachedImages.length > 0)" class="image-preview-container">
        <!-- 기존 파일들 -->
        <div v-for="(file, index) in existingImages" :key="'existing-' + index" class="image-preview-item" @click="removeExistingImage(index)">
          <img v-if="isImageFile(file.fileUrl || file)" :src="resolveImageUrl(file.fileUrl || file)" alt="기존 파일" class="preview-image" />
          <div v-else class="file-icon">
            <i class="bi bi-file-earmark"></i>
            <span class="file-name">{{ getFileName(file) }}</span>
          </div>
        </div>
        <!-- 새로 추가된 파일들 -->
        <div v-for="(file, index) in formData.attachedImages" :key="'new-' + index" class="image-preview-item" @click="removeNewImage(index)">
          <img v-if="isImageFileType(file.type)" :src="getImagePreviewUrl(file)" alt="새 파일" class="preview-image" />
          <div v-else class="file-icon">
            <i class="bi bi-file-earmark"></i>
            <span class="file-name">{{ file.name }}</span>
          </div>
        </div>
        <!-- 파일 추가 버튼 -->
        <div class="image-add-item" @click="handleImageUpload">
          <img src="@/assets/img/imgPlus.jpg" alt="파일 추가" class="add-image-icon" />
        </div>
      </div>

      <!-- 푸터 (버튼들) -->
      <div class="form-footer">
        <div class="form-actions-left">
          <img src="@/assets/img/attach.png" alt="" @click="handleImageUpload">
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
    
    <!-- 글 수정 확인 모달 -->
    <EditConfirmModal
      :visible="showEditConfirmModal"
      @confirm="confirmEdit"
      @cancel="cancelEdit"
      @close="closeEditModal"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import EditConfirmModal from '@/components/common/modal/EditConfirmModal.vue'

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  boardType: {
    type: Number,
    default: 1 // 기본값은 자유게시판
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

// 기존 이미지 URL 목록
const existingImages = ref([])

// 삭제된 기존 이미지 URL 목록 (서버에 삭제 요청할 때 사용)
const deletedImages = ref([])

// 글 수정 확인 모달 표시 여부
const showEditConfirmModal = ref(false)

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
    console.log(props.post)
    
    // 기존 이미지 설정 - files 배열이 있으면 사용, 없으면 fileUrls 사용
    if (props.post.files && props.post.files.length > 0) {
      existingImages.value = [...props.post.files]
    } else if (props.post.fileUrls && props.post.fileUrls.length > 0) {
      // 기존 fileUrls만 있는 경우 (호환성)
      existingImages.value = props.post.fileUrls.map(url => ({ fileUrl: url }))
    }
  }
})

// 폼 제출 처리
function handleSubmit() {
  if (!formData.value.boardTitle.trim() || !formData.value.boardContent.trim()) {
    alert('제목과 내용을 입력해주세요.')
    return
  }

  // 글 수정 확인 모달 표시
  showEditConfirmModal.value = true
}

// 글 수정 확인 처리
function confirmEdit() {
  // 부모 컴포넌트로 수정된 데이터 전달
  emit('submit', {
    id: props.post.id,
    boardTitle: formData.value.boardTitle,
    boardContent: formData.value.boardContent,
    questionYn: formData.value.questionYn,
    attachedImages: formData.value.attachedImages, // 새로 추가된 이미지
    existingImages: existingImages.value, // 남아있는 기존 이미지
    deletedImages: deletedImages.value // 삭제된 기존 이미지
  })
  
  showEditConfirmModal.value = false
}

// 글 수정 취소 처리
function cancelEdit() {
  showEditConfirmModal.value = false
}

// 모달 닫기 처리
function closeEditModal() {
  showEditConfirmModal.value = false
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
  const files = Array.from(event.target.files)
  if (!files.length) return

  // 자유게시판(1)은 이미지만, 다른 게시판은 모든 파일 허용
  if (props.boardType === 1) {
    // 이미지 파일만 필터링
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
    const filteredFiles = files.filter(file => allowedImageTypes.includes(file.type))

    if (filteredFiles.length === 0) {
      alert('이미지 파일만 첨부할 수 있습니다.')
      return
    }
    
    // 기존 파일에 새 파일 추가
    formData.value.attachedImages = [...formData.value.attachedImages, ...filteredFiles]
  } else {
    // 모든 파일 허용 (자료공유, 공지사항 등)
    formData.value.attachedImages = [...formData.value.attachedImages, ...files]
  }
  
  // 파일 입력 초기화
  event.target.value = ''
}

// 이미지 미리보기 URL 생성 (새 이미지용)
function getImagePreviewUrl(file) {
  return URL.createObjectURL(file)
}

// 이미지 URL 해결 (기존 이미지용)
function resolveImageUrl(url) {
  const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'
  return `${baseUrl}${url}`
}

// 기존 이미지 삭제
function removeExistingImage(index) {
  const deletedImage = existingImages.value[index]
  deletedImages.value.push(deletedImage)
  existingImages.value.splice(index, 1)
}

// 새로 추가된 이미지 삭제
function removeNewImage(index) {
  formData.value.attachedImages.splice(index, 1)
}

// 파일이 이미지인지 확인 (URL 기반)
function isImageFile(fileUrl) {
  if (typeof fileUrl === 'object' && fileUrl.fileType) {
    return fileUrl.fileType.startsWith('image/')
  }
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
  const url = fileUrl.toLowerCase()
  return imageExtensions.some(ext => url.includes(ext))
}

// 파일이 이미지인지 확인 (MIME 타입 기반)
function isImageFileType(mimeType) {
  return mimeType && mimeType.startsWith('image/')
}

// 파일명 추출
function getFileName(file) {
  if (typeof file === 'object' && file.originalName) {
    return file.originalName
  }
  // URL에서 파일명 추출
  const url = file.fileUrl || file
  const parts = url.split('/')
  return parts[parts.length - 1]
}

// 게시판 타입명 반환
function getBoardTypeName() {
  const boardTypeNames = {
    1: '자유게시판',
    2: '자료공유',
    3: 'BEST',
    4: '공지사항',
    5: '프로젝트 소개'
  }
  return boardTypeNames[props.boardType] || '게시판'
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #dddddd;

      .form-actions-left {
        img {
          width: 40px;
          height: 40px;
          cursor: pointer;
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
    
    // 이미지 미리보기창 스타일
    .image-preview-container {
      height: 121px;
      border-top: 1px solid #dddddd;
      padding: 16px;
      display: flex;
      gap: 4px;
      align-items: center;
      overflow-x: auto;
      background: #fff;
      
      .image-preview-item {
        position: relative;
        width: 85px;
        height: 85px;
        flex-shrink: 0;
        border: 1px solid #dddddd;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        
        &:hover {
          opacity: 0.8;
        }
        
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
        border: 1px solid #dddddd;
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