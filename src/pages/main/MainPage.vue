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
        <MainBodyCenter 
          v-if="route.meta.showCenter"
          @board-item-click="handleBoardItemClick"
          :has-project-posts="hasProjectPosts"
        />
        <MainRight v-if="route.meta.showRight"/>
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import MainHeader from '@/components/common/MainHeader.vue'
import MainNav from "@/components/common/MainNav.vue"
import MainFooter from "@/components/common/MainFooter.vue"
import MainRight from "@/components/common/MainRight.vue"
import { useNotifications } from '@/composables/useNotifications'
import MainLeft from "@/components/main/MainLeft.vue";
import MainBodyCenter from "@/components/main/MainBodyCenter.vue";
import instance from '@/utils/axios';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

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

const handleLogout = async () => {
  try {
    // 1. 서버에 로그아웃 요청
    await instance.post('api/members/logout')

    // 2. 프론트 상태 초기화
    userStore.clearUser({})

    // 3. (옵션) JS에서 쿠키 직접 제거 시도
    document.cookie = 'refreshToken=; Path=/; Max-Age=0;'

    // 4. 로그인 페이지로 이동
    router.replace('/login')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}

const handleActivityNavigate = (item) => {
  console.log('활동 메뉴 클릭:', item)
  // 라우터를 이용한 페이지 이동
  router.push(item.route)
}

// 컴포넌트 마운트 시 알림 시스템 초기화
onMounted(async () => {
  // 1. 구글 로그인 redirect에서 쿼리로 accessToken을 받는 경우 체크
  const accessToken = route.query.accessToken;
  if (accessToken) {
    // accessToken을 Pinia에 저장하고 /api/members/me 호출
    await userStore.login({ token: accessToken });

    // 쿼리 파라미터를 주소창에서 깔끔하게 제거 (UX!)
    router.replace({ path: router.currentRoute.value.path, query: {} });
  } else {
    //복구용 함수 호출 (localStorage → Pinia → me API 동기화)
    await userStore.restoreUser();
  }

  console.log('Pinia에 현재 저장된 state:', userStore.$state);
  initializeNotifications();
});

// 컴포넌트 언마운트 시 정리
onBeforeUnmount(() => {
  cleanup()
})

// 게시글 상세 페이지 넘어가기
const handleBoardItemClick = ({ boardType, itemId }) => {
  console.log(itemId)
  if (boardType === '공지사항') {
    router.push(`/main-page/notice/${itemId.itemId}`)
  } else if (boardType === '자유게시판') {
    router.push(`/main-page/free-board/${itemId.itemId}`)
  } else if (boardType === '자료공유 게시판') {
    router.push(`/main-page/share-board/${itemId.itemId}`)
  } else if (boardType === '프로젝트 소개') {
      router.push(`/main-page/project-board/${itemId.itemId}`)
  } else {
      router.push(``)
  } 
}

const hasProjectPosts = ref(true) // 기본값 true로 설정

watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath.startsWith('/main-page/project-board')) {
      // 예시: 게시글 목록이 비어있는지 판단해 상태 설정 (실제 구현은 API 연동 필요)
      const projectPostList = [] // 여기를 실제 데이터로 대체
      hasProjectPosts.value = projectPostList.length > 0
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>

</style>