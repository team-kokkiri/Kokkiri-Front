<template>
  <div class="user-management-detail">
    <!-- 헤더 -->
    <div class="detail-header">
      <div class="header-content">
        <button class="back-btn" @click="handleBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div class="header-title">
          <span>회원관리</span>
        </div>
      </div>
      <div class="header-line"></div>
    </div>

    <!-- 사용자 프로필 카드 -->
    <UserProfileCard 
      :user="selectedUser"
      class="profile-section"
    />

    <!-- 관리 액션 섹션 -->
    <UserManagementActions
      :user="selectedUser"
      @permission-change="handlePermissionChange"
      @account-restriction="handleAccountRestriction"
      class="actions-section"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import UserProfileCard from './UserProfileCard.vue'
import UserManagementActions from './UserManagementActions.vue'

// ===== Props =====
const props = defineProps({
  selectedUser: {
    type: Object,
    required: true
  }
})

// ===== Emits =====
const emit = defineEmits(['back', 'user-updated'])

// ===== 이벤트 핸들러 =====
function handleBack() {
  emit('back')
}

function handlePermissionChange(data) {
  // 권한 변경 처리
  emit('user-updated', {
    userId: props.selectedUser.id,
    type: 'permission',
    data
  })
}

function handleAccountRestriction(data) {
  // 계정 제한 처리
  emit('user-updated', {
    userId: props.selectedUser.id,
    type: 'restriction',
    data
  })
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.user-management-detail {
  width: 100%;
  height: 100%;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0 0;
  background: $white;
  display: flex;
  flex-direction: column;
}

.detail-header {
  flex-shrink: 0;
  border-bottom: 1px solid $dim-gray;

  .header-content {
    height: 72px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: relative;

    .back-btn {
      width: 26px;
      height: 26px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $dark-black;
      font-size: 18px;
      transition: color 0.2s ease;

      &:hover {
        color: $main-color;
      }
    }

    .header-title {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      span {
        font-family: $secondary-kr;
        font-weight: 500;
        font-size: 18px;
        line-height: 1.252;
        color: $dark-black;
      }
    }
  }

  .header-line {
    width: 100%;
    height: 1px;
    background: $dim-gray;
  }
}

.profile-section {
  flex-shrink: 0;
  padding: 50px;
  display: flex;
  justify-content: center;
}

.actions-section {
  flex: 1;
  padding: 0 50px 50px;
}
</style>