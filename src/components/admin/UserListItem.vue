<template>
  <div class="user-list-item">
    <div class="user-avatar">
      <div class="avatar-circle"></div>
    </div>
    
    <div class="user-info">
      <div class="user-name">{{ user.name }}</div>
      <div class="user-email">{{ user.email }}</div>
    </div>
    
    <div class="user-actions">
      <button 
        class="manage-btn"
        @click="handleManage"
      >
        관리
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// ===== Props =====
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

// ===== Emits =====
const emit = defineEmits(['manage'])

// ===== 이벤트 핸들러 =====
function handleManage() {
  emit('manage', props.user)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.user-list-item {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0;

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
      // TODO: 실제 아바타 이미지 적용 시 background-image 사용
    }
  }

  .user-info {
    flex: 1;
    margin-left: 20px;

    .user-name {
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 22px;
      line-height: 1.252;
      color: $dark-black;
      margin-bottom: 4px;
    }

    .user-email {
      font-family: $primary-kr;
      font-weight: 500;
      font-size: 16px;
      line-height: 1.2;
      color: $dark-black;
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
      font-size: 16px;
      line-height: 1.2;
      color: $white;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: darken($main-color, 10%);
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }
}
</style>
