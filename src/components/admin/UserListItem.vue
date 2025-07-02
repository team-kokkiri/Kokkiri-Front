<template>
  <div v-if="isValidUser" class="user-list-item">
    <div class="user-avatar">
      <div class="avatar-circle">
        <img
            :src="getProfileImageUrl(user.avatar || user.profileImage)"
            :alt="`${user.name} 프로필`"
            class="avatar-image"
            @error="handleImageError"
        />
      </div>
    </div>

    <div class="user-info">
      <div class="user-name">{{ user.name }}</div>
      <div class="user-email">{{ user.email }}</div>
      <div v-if="user.role" class="user-role">{{ getRoleText(user.role) }}</div>
    </div>

    <div class="user-status">
      <span
          :class="['status-badge', getStatusClass(user)]"
      >
        {{ getStatusText(user) }}
      </span>
    </div>

    <div class="user-actions">
      <button
          class="manage-btn"
          @click="handleManage"
          :disabled="isLoading"
      >
        {{ isLoading ? '처리중...' : '관리' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref } from 'vue'
import { getProfileImageUrl, handleImageError } from '@/utils/profileImage'

// ===== Props =====
const props = defineProps({
  user: {
    type: Object,
    required: true,
    validator: (user) => {
      return user &&
          typeof user.id !== 'undefined' &&
          typeof user.name === 'string' &&
          typeof user.email === 'string'
    }
  }
})

// ===== Emits =====
const emit = defineEmits(['manage'])

// ===== 상태 관리 =====
const isLoading = ref(false)

// ===== Computed (SSOT) =====
const isValidUser = computed(() => {
  return props.user &&
      props.user.name &&
      props.user.email &&
      typeof props.user.name === 'string' &&
      typeof props.user.email === 'string'
})

// ===== 유틸리티 함수 (SRP) =====
function getRoleText(role) {
  const roleMap = {
    'admin': '관리자',
    'normal': '일반회원',
    'user': '일반회원'
  }
  return roleMap[role] || '일반회원'
}

function getStatusClass(user) {
  // isActive가 false이거나 isRestricted가 true인 경우 제한 상태
  if (user.isActive === false || user.isRestricted === true) return 'restricted'
  return 'active'
}

function getStatusText(user) {
  // isActive가 false이거나 isRestricted가 true인 경우 제한 상태
  if (user.isActive === false || user.isRestricted === true) return '제한'
  return '정상'
}

// 이미지 에러 처리는 공통 함수 사용

// ===== 이벤트 핸들러 =====
async function handleManage() {
  if (isLoading.value || !isValidUser.value) return

  try {
    isLoading.value = true
    emit('manage', props.user)
  } catch (error) {
    console.error('사용자 관리 처리 중 오류:', error)
  } finally {
    // 짧은 지연 후 로딩 상태 해제 (UX 개선)
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.user-list-item {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba($dim-gray, 0.3);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba($main-color, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: $light-gray;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .user-info {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .user-name {
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 18px;
      line-height: 1.3;
      color: $dark-black;
      margin-bottom: 4px;
    }

    .user-email {
      font-family: $primary-kr;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.2;
      color: rgba($dark-black, 0.7);
      margin-bottom: 2px;
    }

    .user-role {
      font-family: $primary-kr;
      font-weight: 500;
      font-size: 12px;
      line-height: 1.2;
      color: $main-color;
    }
  }

  .user-status {
    margin-right: 15px;

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-family: $primary-kr;
      font-weight: 500;
      font-size: 12px;
      line-height: 1.2;

      &.active {
        background: rgba($main-color, 0.1);
        color: $main-color;
      }

      &.inactive {
        background: rgba($silver-black, 0.1);
        color: $silver-black;
      }

      &.restricted {
        background: rgba($orangered, 0.1);
        color: $orangered;
      }
    }
  }

  .user-actions {
    margin-right: 0;

    .manage-btn {
      width: 65px;
      height: 36px;
      background: $main-color;
      border: none;
      border-radius: 15px;
      font-family: $primary-kr;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.2;
      color: $white;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: darken($main-color, 10%);
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}
</style>