<template>
  <div class="profile-image-upload">
    <div class="upload-container">
      <h2 class="upload-title">프로필 사진 변경</h2>
      
      <!-- 현재 프로필 이미지 미리보기 -->
      <div class="current-image-preview">
        <div class="image-wrapper">
          <img
            :src="previewImage || getProfileImageUrl(userStore.avatar)"
            :alt="userStore.email + ' 프로필 이미지'"
            @error="handleImageError"
          />
        </div>
        <p class="image-description">현재 프로필 사진</p>
      </div>

      <!-- 파일 업로드 영역 -->
      <div class="upload-area">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          style="display: none;"
        />
        
        <div
          class="drop-zone"
          :class="{ 'drag-over': isDragOver }"
          @click="openFileDialog"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <div class="drop-zone-content">
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="upload-text">
              <span class="primary-text">클릭하여 파일 선택</span><br>
              <span class="secondary-text">또는 파일을 여기로 드래그하세요</span>
            </p>
            <p class="file-info">JPG, PNG, GIF 파일만 지원 (최대 5MB)</p>
          </div>
        </div>
      </div>

      <!-- 선택된 파일 정보 -->
      <div v-if="selectedFile" class="file-info-display">
        <div class="file-details">
          <svg class="file-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 2V9H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="file-text">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <button
            class="remove-file-btn"
            @click="removeSelectedFile"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 업로드 진행상황 -->
      <div v-if="isUploading" class="upload-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <p class="progress-text">업로드 중... {{ uploadProgress }}%</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-message">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- 성공 메시지 -->
      <div v-if="successMessage" class="success-message">
        <svg class="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.08V12C21.9985 14.1564 21.3895 16.2547 20.2542 18.0621C19.1188 19.8695 17.5104 21.3095 15.618 22.2092C13.7257 23.1089 11.6392 23.4278 9.58299 23.1287C7.52678 22.8297 5.59014 21.9264 4.03551 20.5398C2.48089 19.1532 1.36693 17.3441 0.824142 15.3465C0.281357 13.3488 0.339729 11.2472 1.00125 9.28367C1.66277 7.32016 2.89833 5.57982 4.56622 4.28795C6.23411 2.99608 8.26484 2.21067 10.41 2.02" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ successMessage }}</span>
      </div>

      <!-- 버튼 영역 -->
      <div class="button-group">
        <button
          class="btn-secondary"
          @click="$emit('back')"
          :disabled="isUploading"
        >
          취소
        </button>
        <button
          class="btn-primary"
          @click="uploadProfileImage"
          :disabled="!selectedFile || isUploading"
        >
          <span v-if="isUploading">업로드 중...</span>
          <span v-else>변경하기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useUserStore } from '@/stores/user'
import instance from '@/utils/axios'
import defaultProfileImage from '@/assets/img/0.png'

const emit = defineEmits(['back', 'upload-success'])

const userStore = useUserStore()

// 상태 관리
const fileInput = ref(null)
const selectedFile = ref(null)
const previewImage = ref(null)
const isDragOver = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')
const successMessage = ref('')

// 파일 선택 다이얼로그 열기
const openFileDialog = () => {
  fileInput.value?.click()
}

// 파일 선택 처리
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

// // 드래그 앤 드롭 처리
// const handleDragOver = (event) => {
//   isDragOver.value = true
// }
//
// const handleDragLeave = (event) => {
//   isDragOver.value = false
// }

const handleDrop = (event) => {
  isDragOver.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    validateAndSetFile(files[0])
  }
}

// 파일 유효성 검사 및 설정
const validateAndSetFile = (file) => {
  clearMessages()
  
  // 파일 타입 체크
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = '지원하지 않는 파일 형식입니다. JPG, PNG, GIF 파일만 업로드 가능합니다.'
    return
  }
  
  // 파일 크기 체크 (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    errorMessage.value = '파일 크기가 너무 큽니다. 5MB 이하의 파일만 업로드 가능합니다.'
    return
  }
  
  selectedFile.value = file
  
  // 미리보기 이미지 생성
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 선택된 파일 제거
const removeSelectedFile = () => {
  selectedFile.value = null
  previewImage.value = null
  fileInput.value.value = ''
  clearMessages()
}

// 메시지 초기화
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

// 파일 크기 포맷팅
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 이미지 에러 처리
const handleImageError = (event) => {
  event.target.src = defaultProfileImage
}

// 프로필 이미지 URL 구성
const getProfileImageUrl = (avatar) => {
  if (!avatar) return defaultProfileImage
  
  // 이미 완전한 URL인 경우 (http/https로 시작)
  if (avatar.startsWith('http')) {
    return avatar
  }
  
  // 상대 경로인 경우 백엔드 서버 URL과 결합
  const baseUrl = 'http://localhost:9090' // 백엔드 서버 URL
  return baseUrl + avatar
}

// 프로필 이미지 업로드
const uploadProfileImage = async () => {
  if (!selectedFile.value) return
  
  clearMessages()
  isUploading.value = true
  uploadProgress.value = 0
  
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    const response = await instance.post('/api/members/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        uploadProgress.value = progress
      }
    })
    
    if (response.data && response.data.profileImageUrl) {
      // Pinia 스토어 업데이트 (이미 localStorage 저장 포함)
      userStore.updateAvatar(response.data.profileImageUrl)
      
      successMessage.value = '프로필 사진이 성공적으로 변경되었습니다!'
      
      // 2초 후 성공 이벤트 emit
      setTimeout(() => {
        emit('upload-success')
      }, 2000)
    }
    
  } catch (error) {
    console.error('프로필 이미지 업로드 오류:', error)
    
    if (error.response?.status === 401) {
      errorMessage.value = '인증이 만료되었습니다. 다시 로그인해주세요.'
    } else if (error.response?.status === 413) {
      errorMessage.value = '파일 크기가 너무 큽니다.'
    } else if (error.response?.data?.error) {
      // 백엔드에서 넘어온 에러 메시지 사용
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = '프로필 사진 업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
    }
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.profile-image-upload {
  width: 478px;
  margin: 0 auto;
  
  .upload-container {
    background: $white;
    border: 1px solid $dim-gray;
    border-radius: 15px;
    padding: 24px;
    
    .upload-title {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 22px;
      line-height: 1.252;
      color: $dark-black;
      margin-bottom: 24px;
      text-align: center;
    }
    
    .current-image-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 32px;
      
      .image-wrapper {
        width: 120px;
        height: 120px;
        border-radius: 15px;
        overflow: hidden;
        background: $light-gray;
        margin-bottom: 12px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .image-description {
        font-family: $secondary-kr;
        font-weight: 400;
        font-size: 14px;
        color: $silver-black;
        margin: 0;
      }
    }
    
    .upload-area {
      margin-bottom: 20px;
      
      .drop-zone {
        border: 2px dashed $dim-gray;
        border-radius: 15px;
        padding: 40px 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: $main-color;
          background: rgba(33, 150, 243, 0.05);
        }
        
        &.drag-over {
          border-color: $main-color;
          background: rgba(33, 150, 243, 0.1);
        }
        
        .drop-zone-content {
          .upload-icon {
            width: 48px;
            height: 48px;
            color: $main-color;
            margin-bottom: 16px;
          }
          
          .upload-text {
            margin-bottom: 12px;
            
            .primary-text {
              font-family: $secondary-kr;
              font-weight: 500;
              font-size: 16px;
              color: $main-color;
            }
            
            .secondary-text {
              font-family: $secondary-kr;
              font-weight: 400;
              font-size: 14px;
              color: $silver-black;
            }
          }
          
          .file-info {
            font-family: $secondary-kr;
            font-weight: 400;
            font-size: 12px;
            color: $silver-black;
            margin: 0;
          }
        }
      }
    }
    
    .file-info-display {
      background: $light-gray;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 20px;
      
      .file-details {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .file-icon {
          width: 24px;
          height: 24px;
          color: $main-color;
          flex-shrink: 0;
        }
        
        .file-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          
          .file-name {
            font-family: $secondary-kr;
            font-weight: 500;
            font-size: 14px;
            color: $dark-black;
          }
          
          .file-size {
            font-family: $secondary-kr;
            font-weight: 400;
            font-size: 12px;
            color: $silver-black;
          }
        }
        
        .remove-file-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: none;
          cursor: pointer;
          color: $crimson;
          flex-shrink: 0;
          
          &:hover {
            opacity: 0.7;
          }
          
          svg {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    
    .upload-progress {
      margin-bottom: 20px;
      
      .progress-bar {
        width: 100%;
        height: 8px;
        background: $silver-gray;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
        
        .progress-fill {
          height: 100%;
          background: $main-color;
          transition: width 0.3s ease;
        }
      }
      
      .progress-text {
        font-family: $secondary-kr;
        font-weight: 400;
        font-size: 14px;
        color: $silver-black;
        text-align: center;
        margin: 0;
      }
    }
    
    .error-message,
    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 14px;
      
      svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
    }
    
    .error-message {
      background: #FEF2F2;
      color: $crimson;
      border: 1px solid #FECACA;
      
      .error-icon {
        color: $crimson;
      }
    }
    
    .success-message {
      background: #F0FDF4;
      color: $forestgreen;
      border: 1px solid #BBF7D0;
      
      .success-icon {
        color: $forestgreen;
      }
    }
    
    .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      
      .btn-secondary,
      .btn-primary {
        height: 40px;
        border-radius: 20px;
        font-family: $secondary-kr;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        min-width: 100px;
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
      
      .btn-secondary {
        background: $white;
        color: $silver-black;
        border: 1px solid $dim-gray;
        
        &:hover:not(:disabled) {
          background: $light-gray;
        }
      }
      
      .btn-primary {
        background: $main-color;
        color: $white;
        
        &:hover:not(:disabled) {
          background: $royalblue;
        }
      }
    }
  }
}
</style>