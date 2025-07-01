<template>
  <div class="mypage-profile-box">
    <div class="profile-header">
      <span class="profile-title">내 정보</span>
      <div class="header-buttons">
        <button
            class="photo-change-btn"
            @click="$emit('profile-image-change')"
        >
          사진변경
        </button>
        <button
            class="logout-btn"
            @click="$emit('logout')"
        >
          로그아웃
        </button>
      </div>
    </div>
    <div class="profile-content">
      <div class="profile-image">
        <img
            :src="getProfileImageUrl(userStore.avatar)"
            :alt="`${userStore.email} 프로필 이미지`"
            @error="handleImageError"
        />
      </div>
      <div class="profile-info">
        <span class="profile-name">{{ displayName }}</span>
        <span class="profile-email">{{ userStore.email }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import defaultProfileImage from '@/assets/img/0.png'

defineEmits(['logout', 'profile-image-change'])

const userStore = useUserStore()

// 이미지 에러 처리
const handleImageError = (event) => {
  event.target.src = defaultProfileImage
}

// 프로필 이미지 URL 구성
const getProfileImageUrl = (avatar) => {
  console.log('getProfileImageUrl 호출:', avatar)
  if (!avatar) return defaultProfileImage
  
  // 이미 완전한 URL인 경우 (http/https로 시작)
  if (avatar.startsWith('http')) {
    return avatar
  }
  
  // 상대 경로인 경우 백엔드 서버 URL과 결합
  const baseUrl = 'http://localhost:9090' // 백엔드 서버 URL
  const fullUrl = baseUrl + avatar
  console.log('생성된 이미지 URL:', fullUrl)
  return fullUrl
}

const displayName = computed(() => {
  return userStore.displayName || ''
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.mypage-profile-box {
  width: 478px;
  height: 146px;
  border: 1px solid $dim-gray;
  border-radius: 15px;
  padding: 22px 19px 27px 19px;
  background: $white;

  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 19px;

    .profile-title {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 22px;
      line-height: 1.252;
      color: $dark-black;
    }

    .header-buttons {
      display: flex;
      gap: 8px;

      .photo-change-btn,
      .logout-btn {
        width: 70px;
        height: 30px;
        background: $main-color;
        border-radius: 30px;
        border: none;
        font-family: $secondary-kr;
        font-weight: 500;
        font-size: 12px;
        line-height: 1.252;
        color: $white;
        cursor: pointer;

        &:hover {
          background: $royalblue;
        }
      }

      .photo-change-btn {
        // 사진변경 버튼 별도 스타일 (현재는 동일)
      }

      .logout-btn {
        // 로그아웃 버튼 별도 스타일 (현재는 동일)
      }
    }
  }

  .profile-content {
    display: flex;
    align-items: center;
    gap: 16px;

    .profile-image {
      width: 56px;
      height: 56px;
      border-radius: 15px;
      overflow: hidden;
      background: $light-gray;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .profile-name {
        font-family: $secondary-kr;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.252;
        color: $black;
      }

      .profile-email {
        font-family: $secondary-kr;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.252;
        color: $silver-black;
      }
    }
  }
}
</style>