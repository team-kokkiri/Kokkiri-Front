<template>

  <div class="mainpage-header">
    <div class="header-inner">
      <div class="header-row">
        <div class="header-left">
          <img src="../assets/img/메인페이지로고.png" alt="로고" />
        </div>
        <div class="header-center">
          <div
              v-for="menu in menuList"
              :key="menu"
              class="gnb-menu-item"
              :class="{ active: activeMenu === menu }"
              @click="activeMenu = menu"
          >
            <span class="menu-text">{{ menu }}</span>
            <span class="menu-underline"></span>
          </div>
        </div>
        <div class="header-right">
          <div class="util-icon-item">
            <div class="icon-badge-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
              </svg>
              <em>99</em>
            </div>
          </div>
          <div class="util-icon-item">
            <div class="icon-badge-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
              </svg>
              <em>99</em>
            </div>
          </div>
          <div class="util-icon-item">
            <div class="icon-badge-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
<script setup>
  import { ref } from 'vue'
  const activeMenu = ref('게시판')   // 기본 활성 메뉴명

  const menuList = [
    '게시판',
    '캘린더',
    '파티찾기',
    '공지사항',
    '관리자페이지'
  ]
</script>