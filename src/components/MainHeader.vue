<template>

  <div class="mainpage-header">
    <div class="header-inner">
      <div class="header-row">
        <div class="header-left" @click="goMain">
          <img src="../assets/img/메인페이지로고.png" alt="로고" />
        </div>
        <div class="header-center">
          <div
              v-for="menu in menuList"
              :key="menu.name"
              class="gnb-menu-item"
              :class="{ active: activeMenu === menu.name }"
              @click="handleMenuClick(menu)"
          >
            <span class="menu-text">{{ menu.name }}</span>
            <span class="menu-underline"></span>
          </div>
        </div>
        <div class="header-right">
          <!-- 알림(벨) 아이콘: 팝업 토글 -->
          <div class="util-icon-item">
            <button type="button" class="icon-btn" @click="toggleNotification">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
              </svg>
              <em>99</em>
            </button>
            <!-- 알림 팝업 드롭다운 -->
            <div v-if="showNotification" class="notification-dropdown" ref="notificationRef">
              <div class="notification-header">
                <h3 class="title">알림</h3>
                <em class="badge-count">8</em>
                <button type="button" class="btn-read-all">모두 읽음</button>
              </div>
              <div class="notification-list">
                <div
                    class="notification-item"
                    v-for="item in notifications"
                    :key="item.id"
                >
                  <div
                      class="item-mark"
                      :class="{ 'invite': item.type === 'invite' }"
                  ></div>
                  <div class="item-content">
                    <p class="message">{{ item.message }}</p>
                    <span class="datetime">{{ item.datetime }}</span>
                  </div>
                  <div class="btn-action-wrap">
                    <template v-if="item.type === 'invite'">
                      <button class="btn-accept">수락</button>
                      <button class="btn-reject">거절</button>
                    </template>
                    <template v-else>
                      <button class="btn-delete">삭제</button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 채팅 아이콘: 페이지 이동 -->
          <div class="util-icon-item">
            <button type="button" class="icon-btn" @click="goChat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
              </svg>
              <em>99</em>
            </button>
          </div>
          <!-- 마이페이지 아이콘: 페이지 이동 -->
          <div class="util-icon-item">
            <button type="button" class="icon-btn" @click="goMypage">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
<script setup>
  import { ref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { onMounted, onBeforeUnmount } from 'vue'

  const router = useRouter()
  const route = useRoute()
  const showNotification = ref(false)
  const notificationRef = ref(null)

  // 메뉴 리스트
  const menuList = [
    { name: '게시판', path: '' },
    { name: '캘린더', path: '/calendar' },
    { name: '파티찾기', path: '/party' },
    { name: '공지사항', path: '/notice' },
    { name: '관리자페이지', path: '/admin' }
  ]
  // 알림 리스트 << 실제로는 백엔드에서 데이터 가져와야함!!
  const notifications = [
    {
      id: 1,
      type: 'invite',
      message: "고라니 님의 채팅방에 초대되었습니다.",
      datetime: "2025.06.16 08:48"
    },
    {
      id: 2,
      type: 'comment',
      message: "내 게시글에 댓글이 등록되었습니다",
      datetime: "2025.06.16 08:48"
    },
    {
      id: 3,
      type: 'comment',
      message: "내 게시글에 댓글이 등록되었습니다",
      datetime: "2025.06.16 08:48"
    },
    {
      id: 4,
      type: 'comment',
      message: "내 게시글에 댓글이 등록되었습니다",
      datetime: "2025.06.16 08:48"
    },
    {
      id: 5,
      type: 'comment',
      message: "내 게시글에 댓글이 등록되었습니다",
      datetime: "2025.06.16 08:48"
    },
    {
      id: 6,
      type: 'comment',
      message: "내 게시글에 댓글이 등록되었습니다",
      datetime: "2025.06.16 08:48"
    },
    {
      id: 7,
      type: 'comment',
      message: "내 게시글에 댓글이 등록되었습니다",
      datetime: "2025.06.16 08:48"
    },
  ]

  // activeMenu: URL에 따라 자동 동기화(설명은 아래에!)
  const activeMenu = ref('게시판')
  watch(
      () => route.path,
      (newPath) => {
        const found = menuList.find(menu => `/main-page${menu.path}` === newPath)
        if (found) activeMenu.value = found.name
      },
      { immediate: true }
  )

  // 메뉴 클릭 핸들러
  function handleMenuClick(menu) {
    activeMenu.value = menu.name
    router.push(`/main-page${menu.path}`)
  }

  // 알림 팝업
  function toggleNotification() {
    showNotification.value = !showNotification.value
  }

  // 화면 바깥 클릭 시 알림창 닫히게
  ///////////////////////////////////////////////////////////////////
  function handleClickOutside(event) {
    if (
        showNotification.value &&
        notificationRef.value &&
        !notificationRef.value.contains(event.target)
    ) {
      showNotification.value = false
    }
  }
  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })
  ///////////////////////////////////////////////////////////////////

  // 채팅, 마이페이지 이동
  function goChat() {
    router.push('/main-page/chat')
  }
  function goMypage() {
    router.push('/main-page/mypage')
  }
  function goMain() {
    router.push('/main-page')
  }
</script>