<template>
  <aside class="admin-sidebar">
    <div class="admin-sidebar-header">
      <h2 class="admin-title">관리자페이지</h2>
    </div>
    
    <div class="admin-menu-list">
      <div
        v-for="menu in menuItems"
        :key="menu.id"
        :class="['admin-menu-item', { active: menu.id === activeMenu }]"
        @click="selectMenu(menu.id)"
      >
        <span class="menu-text">{{ menu.label }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// ===== Props =====
defineProps({
  activeMenu: {
    type: String,
    required: true
  }
})

// ===== Emits =====
const emit = defineEmits(['select-menu'])

// ===== 메뉴 아이템 데이터 (SSOT) =====
const menuItems = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'users', label: '회원관리' },
  { id: 'reports', label: '신고관리' },
  { id: 'problems', label: '일일문제관리' },
]

// ===== 이벤트 핸들러 =====
function selectMenu(menuId) {
  emit('select-menu', menuId)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.admin-sidebar {
  width: 377px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px;
  background: $white;
  display: flex;
  flex-direction: column;

  .admin-sidebar-header {
    padding: 0 17px;
    height: 72px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $dim-gray;
    flex-shrink: 0;
    
    .admin-title {
      font-family: $secondary-kr;
      font-weight: 700;
      font-size: 22px;
      line-height: 1.25;
      color: $black;
      margin: 0;
    }
  }

  .admin-menu-list {
    flex-grow: 1;
    
    .admin-menu-item {
      width: 100%;
      height: 64px;
      padding: 0;
      border-bottom: 1px solid $dim-gray;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      background: $white;

      &:hover {
        background-color: rgba($main-color, 0.05);
      }

      &.active {
        background-color: $main-color;
        
        .menu-text {
          color: $white !important;
        }
      }

      .menu-text {
        font-family: $secondary-kr;
        font-weight: 400;
        font-size: 20px;
        line-height: 1.252;
        color: $dark-black;
        margin-left: 17px;
      }
    }
  }
}
</style>
