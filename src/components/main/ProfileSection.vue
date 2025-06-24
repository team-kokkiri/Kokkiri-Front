<template>
  <div class="profile-section">
    <div class="profile-wrap">
      <div class="profile-img-wrap">
        <img
            :src="currentUser.avatar || defaultProfileImage"
            :alt="`${currentUser.email} 프로필 이미지`"
            class="profile-img"
            @error="handleImageError"
        />
      </div>
      <span class="profile-name">{{ userId }}</span>
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
import { useStore } from 'vuex'
import defaultProfileImage from '@/assets/img/0.png'

// Vuex store 사용
const store = useStore()
const currentUser = computed(() => store.getters['user/currentUser'])

// Emits
defineEmits(['profile-info', 'logout'])

const handleImageError = (event) => {
  event.target.src = defaultProfileImage
}

const userId = computed(() => {
  // currentUser.value.email이 존재하면, @ 전까지 추출
  if (!currentUser.value || !currentUser.value.email) return ''
  return currentUser.value.email.split('@')[0]
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

    .profile-img-wrap {
      width: 60px;
      height: 60px;
      border-radius: 50%;
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