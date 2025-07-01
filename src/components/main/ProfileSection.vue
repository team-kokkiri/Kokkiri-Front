<template>
  <div class="profile-section">
    <div class="profile-wrap">
      <div class="profile-img-wrap">
        <img
            :src="avatarUrl"
            :alt="`${userStore.nickname} 프로필 이미지`"
            class="profile-img"
            @error="handleImageError"
        />
      </div>
      <span class="profile-name">{{ nickname }}</span>
    </div>
    <div class="profile-btns">
      <a
          href="#"
          class="btn-profile-info"
          @click.prevent="$emit('profile-info')"
      >
        내 정보
      </a>
      <button
          type="button"
          class="btn-logout"
          @click="$emit('logout')"
      >
        로그아웃
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue'
import { useUserStore } from '@/stores/user'
import { getProfileImageUrl, handleImageError } from '@/utils/profileImage'

const userStore = useUserStore()

// Emits
defineEmits(['profile-info', 'logout'])

const nickname = computed(() => {
  return userStore.nickname || '익명'
})

//  avatarUrl 처리 (공통 함수 사용)
const avatarUrl = computed(() => {
  return getProfileImageUrl(userStore.avatar)
})

</script>

<style lang="scss" scoped>
.profile-section {
  width: 173px;
  height: 179px;
  background-color: #F5F5F5;
  border: 1px solid #DDDDDD;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 15px;

  .profile-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
    gap: 10px;

    .profile-img-wrap {
      width: 60px;
      height: 60px;
      overflow: hidden;
      background-color: #e0e0e0;

      .profile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    .profile-name {
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 700;
      font-size: 18px;
      line-height: 1.448;
      color: #333333;
      text-align: center;
    }
  }

  .profile-btns {
    bottom: 37px;
    display: flex;
    gap: 10px;
    align-items: center;

    .btn-profile-info,
    .btn-logout {
      padding: 4px 10px;
      border: 1px solid #DDDDDD;
      border-radius: 3px;
      background-color: transparent;
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 350;
      font-size: 13px;
      line-height: 1.231;
      color: #777777;
      text-decoration: none;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: #333333;
      }

      &:active {
        transform: translateY(2px);
      }
    }
  }
}
</style>