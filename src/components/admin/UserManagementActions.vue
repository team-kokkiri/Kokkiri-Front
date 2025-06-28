<template>
  <div class="user-management-actions">
    <!-- 권한 변경 섹션 -->
    <div class="action-section">
      <div class="section-header">
        <h3>권한 변경</h3>
      </div>
      <div class="action-buttons">
        <button
            :class="['action-btn', 'normal-user', { active: isNormalUser }]"
            @click="changePermission('normal')"
        >
          일반 사용자
        </button>
        <button
            :class="['action-btn', 'admin', { active: isAdmin }]"
            @click="changePermission('admin')"
        >
          관리자
        </button>
      </div>
    </div>

    <!-- 계정 제한 섹션 -->
    <div class="action-section">
      <div class="section-header">
        <h3>계정 제한</h3>
      </div>
      <div class="action-buttons">
        <button
            :class="['action-btn', 'unrestrict-btn', { active: !isRestricted }]"
            @click="unrestrictUser"
        >
          제한해제
        </button>
        <button
            :class="['action-btn', 'restrict-btn', { active: isRestricted }]"
            @click="restrictUser"
        >
          사용 제한
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

// ===== Props =====
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

// ===== Emits =====
const emit = defineEmits(['permission-change', 'account-restriction'])

// ===== Computed =====
const isNormalUser = computed(() => {
  const role = props.user.role?.toLowerCase()
  return role === 'user' || role === 'normal' || !role
})
const isAdmin = computed(() => {
  const role = props.user.role?.toLowerCase()
  return role === 'admin'
})
const isRestricted = computed(() => {
  // isActive가 false이거나 isRestricted가 true인 경우 제한 상태
  return props.user.isActive === false || props.user.isRestricted === true
})

// ===== 이벤트 핸들러 =====
function changePermission(role) {
  if (props.user.role === role) return

  emit('permission-change', {
    role,
    previousRole: props.user.role
  })
}

function restrictUser() {
  if (isRestricted.value) return

  emit('account-restriction', {
    isRestricted: true,
    previousStatus: isRestricted.value
  })
}

function unrestrictUser() {
  if (!isRestricted.value) return

  emit('account-restriction', {
    isRestricted: false,
    previousStatus: isRestricted.value
  })
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.user-management-actions {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.action-section {
  border: 1px solid $dim-gray;
  border-top: none;

  &:first-child {
    border-top: 1px solid $dim-gray;
  }

  .section-header {
    height: 76px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid $dim-gray;

    h3 {
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 24px;
      line-height: 1.252;
      color: $dark-black;
      margin: 0;
    }
  }

  .action-buttons {
    height: 76px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 10px;

    .action-btn {
      height: 39px;
      border: none;
      border-radius: 15px;
      padding: 8px 15px;
      font-family: $secondary-kr;
      font-weight: 400;
      font-size: 18px;
      line-height: 1.252;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;

      &.normal-user {
        background: $light-gray;
        color: $dark-black;

        &.active {
          background: $main-color;
          color: $white;
        }

        &:hover:not(.active) {
          background: darken($light-gray, 5%);
        }
      }

      &.admin {
        background: $light-gray;
        color: $dark-black;

        &.active {
          background: $orangered;
          color: $white;
        }

        &:hover:not(.active) {
          background: darken($light-gray, 5%);
        }
      }

      &.restrict-btn {
        background: $main-color;
        color: $white;

        &.active {
          background: $orangered;
          opacity: 1;
        }

        &:not(.active) {
          background: $light-gray;
          color: $dark-black;
        }

        &:hover {
          opacity: 0.9;
        }
      }

      &.unrestrict-btn {
        background: $orangered;
        color: $white;

        &.active {
          background: $main-color;
          opacity: 1;
        }

        &:not(.active) {
          background: $light-gray;
          color: $dark-black;
        }

        &:hover {
          opacity: 0.9;
        }
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }
}
</style>