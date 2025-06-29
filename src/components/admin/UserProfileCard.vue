<template>
  <div class="user-profile-card">
    <div class="profile-avatar">
      <div class="avatar-circle">
        <!-- TODO: 실제 아바타 이미지가 있다면 img 태그로 교체 -->
      </div>
    </div>
    
    <div class="profile-info">
      <div class="user-name">{{ user.name }}</div>
      <div class="user-email">{{ user.email }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// ===== Props =====
defineProps({
  user: {
    type: Object,
    required: true,
    validator: (user) => {
      return user && user.name && user.email
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.user-profile-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 35px;

  .profile-avatar {
    flex-shrink: 0;

    .avatar-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: $light-gray;
      // TODO: 실제 아바타 이미지 적용 시 background-image 사용
      // background-image: url(...);
      // background-size: cover;
      // background-position: center;
    }
  }

  .profile-info {
    .user-name {
      font-family: $secondary-kr;
      font-size: 28px;
      line-height: 1.252;
      color: $dark-black;
      margin-bottom: 9px;
    }

    .user-email {
      font-family: $primary-kr;
      font-weight: 500;
      font-size: 22px;
      line-height: 1.2;
      color: $dark-black;
    }
  }
}
</style>