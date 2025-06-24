<template>
  <div class="container mainpage">
    <MainHeader
        :notifications="notifications"
        :total-unread-notifications="totalUnreadNotifications"
        :is-loading="isLoading"
        :has-more="hasMore"
        @delete-notification="handleDeleteNotification"
        @mark-all-as-read="handleMarkAllAsRead"
        @accept-invitation="handleAcceptInvitation"
        @reject-invitation="handleRejectInvitation"
        @fetch-more-notifications="handleFetchMoreNotifications"
    />
    <MainNav v-if="route.meta.showNav" />
    <div class="mainpage-body">
      <div class="mainbody-inner">
        <router-view />
        <MainLeft
            v-if="route.meta.showLeft"
            @profile-info="handleProfileInfo"
            @logout="handleLogout"
            @activity-navigate="handleActivityNavigate"
        />
        <MainBodyCenter v-if="route.meta.showCenter"/>
        <MainRight v-if="route.meta.showRight"/>
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'  // ← 추가!
import MainHeader from '@/components/common/MainHeader.vue'
import MainNav from "@/components/common/MainNav.vue"
import MainFooter from "@/components/common/MainFooter.vue"
import MainRight from "@/components/common/MainRight.vue"
import { useNotifications } from '@/composables/useNotifications'
import MainLeft from "@/components/main/MainLeft.vue";
import MainBodyCenter from "@/components/main/MainBodyCenter.vue";

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()  // ← 추가!

// 알림 데이터 중앙 관리
const {
  notifications,
  totalUnreadNotifications,
  isLoading,
  hasMore,
  initializeNotifications,
  fetchNotifications,
  markAllAsRead,
  deleteNotification,
  acceptInvitation,
  rejectInvitation,
  cleanup
} = useNotifications()

/**
 * 알림 삭제 이벤트 핸들러
 * @param {string|number} notificationId - 삭제할 알림 ID
 */
function handleDeleteNotification(notificationId) {
  deleteNotification(notificationId)
}

/**
 * 모든 알림 읽음 처리 이벤트 핸들러
 */
function handleMarkAllAsRead() {
  markAllAsRead()
}

/**
 * 초대 수락 이벤트 핸들러
 * @param {string|number} notificationId - 수락할 초대 알림 ID
 */
function handleAcceptInvitation(notificationId) {
  acceptInvitation(notificationId)
}

/**
 * 초대 거절 이벤트 핸들러
 * @param {string|number} notificationId - 거절할 초대 알림 ID
 */
function handleRejectInvitation(notificationId) {
  rejectInvitation(notificationId)
}

/**
 * 추가 알림 로드 이벤트 핸들러 (무한 스크롤)
 */
function handleFetchMoreNotifications() {
  fetchNotifications()
}

// Event Handlers
const handleProfileInfo = () => {
  console.log('프로필 정보 클릭')
  router.push('/main-page/mypage')  // ← 마이페이지로 이동
}

// 로그아웃
const handleLogout = async () => {  // ← 수정!
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('로그아웃 중 오류:', error)
    // 에러가 있어도 로그인 페이지로 이동
    router.push('/login')
  }
}

const handleActivityNavigate = (item) => {
  console.log('활동 메뉴 클릭:', item)
  router.push(item.route)
}

// 인증 체크  ← 추가!
const checkAuth = () => {
  if (!userStore.isLoggedIn && !localStorage.getItem('accessToken')) {
    router.push('/login')
    return false
  }
  return true
}

// 컴포넌트 마운트 시 알림 시스템 초기화
onMounted(async () => {
  // 먼저 토큰 복원 시도
  if (localStorage.getItem('accessToken') && !userStore.isLoggedIn) {
    await userStore.restoreUser()
  }
  
  // 인증 체크
  if (checkAuth()) {
    initializeNotifications()
  }
})

// 컴포넌트 언마운트 시 정리
onBeforeUnmount(() => {
  cleanup()
})
</script>

<style lang="scss" scoped>

</style>