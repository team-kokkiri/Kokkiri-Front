<template>
  <div class="mainpage-header">
    <div class="header-inner">
      <div class="header-row">
        <div class="header-left">
          <img src="../../assets/img/메인페이지로고.png" alt="로고" />
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
              <em>{{ totalUnreadNotifications }}</em>
            </button>
            <!-- 알림 팝업 드롭다운 -->
            <div v-if="showNotification" class="notification-dropdown" ref="notificationRef">
              <div class="notification-header">
                <h3 class="title">알림</h3>
                <em class="badge-count">{{ totalUnreadNotifications }}</em>
                <button type="button" class="btn-read-all" @click="handleMarkAllAsRead">모두 읽음</button>
              </div>
              <div class="notification-list" ref="notificationListRef">
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
                    <span class="datetime">{{ formatLocalDateTime(item.datetime) }}</span>
                  </div>
                  <div class="btn-action-wrap">
                    <template v-if="item.type === 'invite'">
                      <button class="btn-accept" @click="handleAcceptInvitation(item.id)">수락</button>
                      <button class="btn-reject" @click="handleRejectInvitation(item.id)">거절</button>
                    </template>
                    <template v-else>
                      <button class="btn-delete" @click="handleDeleteNotification(item.id)">삭제</button>
                    </template>
                  </div>
                </div>
                <div v-if="isLoading" class="loading-indicator">알림을 불러오는 중...</div>
                <div v-if="notifications.length === 0 && !isLoading" class="no-data">새로운 알림이 없습니다.</div>
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


<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

// Props 정의 - 부모 컴포넌트로부터 알림 데이터를 받음
const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  },
  totalUnreadNotifications: {
    type: Number,
    default: 0
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  },
  formatLocalDateTime: { type: Function, required: true }
})

// Emits 정의 - 부모 컴포넌트로 이벤트 전달
const emit = defineEmits([
  'deleteNotification',
  'markAllAsRead',
  'acceptInvitation',
  'rejectInvitation',
  'fetchMoreNotifications'
])

const router = useRouter()
const route = useRoute()
const showNotification = ref(false)
const notificationRef = ref(null)
const notificationListRef = ref(null)

// 날짜 포맷팅을 위해 composable에서 가져오기
const { formatLocalDateTime} = useNotifications()

// 메뉴 리스트
const menuList = [
  { name: '게시판', path: '' },
  { name: '캘린더', path: '/calendar' },
  { name: '파티찾기', path: '/party' },
  { name: '공지사항', path: '/notice' },
  { name: '관리자페이지', path: '/admin' }
]

// activeMenu: URL에 따라 자동 동기화
const activeMenu = ref('게시판')
watch(
    () => route.path,
    (newPath) => {
      const found = menuList.find(menu => `/main-page${menu.path}` === newPath)
      if (found) activeMenu.value = found.name
    },
    { immediate: true }
)

/**
 * 메뉴 클릭 핸들러
 * @param {object} menu - 선택된 메뉴 객체
 */
function handleMenuClick(menu) {
  activeMenu.value = menu.name
  router.push(`/main-page${menu.path}`)
}

/**
 * 알림 팝업 토글
 */
function toggleNotification() {
  showNotification.value = !showNotification.value
}

/**
 * 알림 삭제 핸들러 - 부모 컴포넌트로 이벤트 전달
 * @param {string|number} notificationId - 삭제할 알림 ID
 */
function handleDeleteNotification(notificationId) {
  emit('deleteNotification', notificationId)
}

/**
 * 모든 알림 읽음 처리 핸들러 - 부모 컴포넌트로 이벤트 전달
 */
function handleMarkAllAsRead() {
  emit('markAllAsRead')
}

/**
 * 초대 수락 핸들러 - 부모 컴포넌트로 이벤트 전달
 * @param {string|number} notificationId - 수락할 초대 알림 ID
 */
function handleAcceptInvitation(notificationId) {
  emit('acceptInvitation', notificationId)
}

/**
 * 초대 거절 핸들러 - 부모 컴포넌트로 이벤트 전달
 * @param {string|number} notificationId - 거절할 초대 알림 ID
 */
function handleRejectInvitation(notificationId) {
  emit('rejectInvitation', notificationId)
}

/**
 * 화면 바깥 클릭 시 알림창 닫기
 * @param {Event} event - 클릭 이벤트
 */
function handleClickOutside(event) {
  if (
      showNotification.value &&
      notificationRef.value &&
      !notificationRef.value.contains(event.target)
  ) {
    showNotification.value = false
  }
}

/**
 * 채팅 페이지로 이동
 */
function goChat() {
  router.push('/main-page/chat')
}

/**
 * 마이페이지로 이동
 */
function goMypage() {
  router.push('/main-page/mypage')
}

// 스크롤 이벤트 핸들러 (무한 스크롤용)
let scrollHandler = null

// 생명주기 훅
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)

  // 알림 드롭다운이 열렸을 때만 스크롤 이벤트 리스너 추가
  watch(showNotification, (newValue) => {
    if (newValue) {
      // 드롭다운이 열리면 리스트 요소에 스크롤 이벤트 리스너 추가
      nextTick(() => {
        if (notificationListRef.value) {
          // 스크롤 핸들러를 생성하여 부모로 이벤트 전달
          scrollHandler = function() {
            const element = notificationListRef.value
            if (!element) return

            const isNearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100

            if (isNearBottom && !props.isLoading && props.hasMore) {
              emit('fetchMoreNotifications')
            }
          }
          notificationListRef.value.addEventListener('scroll', scrollHandler)
        }
      })
    } else {
      // 드롭다운이 닫히면 리스너 제거
      if (notificationListRef.value && scrollHandler) {
        notificationListRef.value.removeEventListener('scroll', scrollHandler)
        scrollHandler = null
      }
    }
  })
})
// onMounted(() => {
//   document.addEventListener('mousedown', handleClickOutside)
  
//   const listEl = notificationListRef.value
//   if (listEl) {
//     listEl.addEventListener('scroll', () => {
//       if (listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 10) {
//         if (props.hasMore && !props.isLoading) {
//           emit('fetchMoreNotifications')
//         }
//       }
//     })
//   }
// })

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)

  if (notificationListRef.value && scrollHandler) {
    notificationListRef.value.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ###### Component-Header #######*/
.mainpage-header {
  width: 100%;
  height: 80px;
  min-width: 1180px;
  min-height: 80px;
  display: flex;
  align-items: center;
  background: #fff; // 필요시 배경색 조절
  border-bottom: 1px solid $dim-gray;
  .header-inner {
    width: 1180px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    //border: 1px solid black;

    .header-row {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-left {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 246px;
          height: 80px; // 로고 이미지 크기 조절
          margin-bottom: 1.5px;
        }
      }

      .header-center {
        display: flex;
        gap: 42px;
        margin-right: 90px;

        .gnb-menu-item {
          position: relative;
          display: flex;
          align-items: center;
          cursor: pointer;
          height: 80px;

          .menu-text {
            font-size: 16px;
            font-weight: bold;
            color: $dark-black;
            transition: color 0.2s;
          }

          &.active {
            border-bottom: 5px solid $main-color;
            padding-top: 10px;
          }
          &:hover .menu-text {
            color: $main-color;
          }
          &.active .menu-text {
            color: $main-color // 활성화된 메뉴 글씨 색상
          }
        }
      }

      .header-right {
        display: flex;
        gap: 24px;
        .util-icon-item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid $light-black;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          // 헤더 우측 버튼3개
          .icon-btn {
            display: flex;
            align-items: center;
            position: relative;
            font-size: 24px;
            background: white;
            border: none;
            i {
              font-size: 24px;
              transition: color 0.2s;
            }
            .bi.bi-bell-fill {
              width: 20px;
              height: 20px;
              fill: white;
              stroke: $dark-black;
              stroke-width: 1.5px;
            }
            .bi.bi-chat-dots-fill {
              width: 20px;
              height: 20px;
              fill: $dim-black;
            }
            .bi.bi-person-fill {
              width: 24px;
              height: 24px;
              fill: $dim-black;
            }

            em {
              width: 20px;
              height: 20px;
              position: absolute;
              top: -15px;
              right: -10px;
              background: $orangered;
              color: white;
              font-size: 12px;
              font-weight: normal;
              border-radius: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          // 알림창 눌렀을때 드롭다운창
          .notification-dropdown {
            position: absolute;
            top: 48px;
            right: 0;
            width: 458px;
            height: 380px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 20px 0 rgba(80, 86, 127, 0.15);
            border: 2px solid $dim-gray;
            z-index: 100;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.18s;

            // 헤더
            .notification-header {
              display: flex;
              align-items: center;
              justify-content: center;
              border-bottom: 1px solid $dim-gray;
              padding: 34px 27px;
              height: 80px;

              h3.title {
                font-size: 24px;
                font-weight: normal;
                color: $dark-black;
                margin: 0 10px 0 0;
              }

              em.badge-count {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                font-size: 16px;
                font-weight: 400;
                background: $orangered;
                color: #fff;
                border-radius: 7px;
                margin-left: 4px;
                margin-top: 3px;
                font-family: SpoqaHanSansNeo-Regular, serif;
                font-style: normal;
              }

              .btn-read-all {
                margin-left: auto;
                background: none;
                border: none;
                color: $orangered;
                font-size: 16px;
                font-weight: 430;
                cursor: pointer;
                padding: 0;
              }
            }

            // 알림 리스트 (최대 5개, 스크롤)
            .notification-list {
              flex: 1 1 0%;
              max-height: 300px;        // 60px * 5
              overflow-y: auto;

              &::-webkit-scrollbar {
                width: 8px;
              }
              &::-webkit-scrollbar-thumb {
                background: #d9d9d9;
                border-radius: 8px;
              }

              .notification-item {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                min-height: 60px;
                height: 60px;
                border-bottom: 1px solid $dim-gray;

                &:last-child {
                  border-bottom: none;
                }

                .item-mark {
                  width: 15px;
                  height: 58px;
                  background: white;
                  flex-shrink: 0;
                  border: none;
                  margin-top: 1px;
                  &.invite {
                    background: $orangered;
                  }
                }

                .item-content {
                  flex: 1 1 0%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  margin-top: 12px;
                  margin-left: 22px;
                  p.message {
                    font-size: 16px;
                    font-weight: 500;
                    color: $dark-black;
                    margin: 0;
                    line-height: 1.2;
                    font-family: $secondary-kr;
                    letter-spacing: 1px;
                  }
                  span.datetime {
                    font-size: 12px;
                    color: $dim-black;
                    margin-top: 2px;
                    font-weight: normal;
                  }
                }
                .btn-action-wrap {
                  display: flex;
                  align-items: center;
                  height: 100%;
                  margin-top: 15px;
                  margin-right: 6px;
                  .btn-delete,
                  .btn-accept,
                  .btn-reject {
                    background: none;
                    border: none;
                    font-size: 12px;
                    font-weight: 430;
                    color: $dim-black;
                    margin-left: 12px;
                    cursor: pointer;
                    padding: 0;
                  }
                }
              }
            }
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px);}
            100% { opacity: 1; transform: translateY(0);}
          }
        }
      }
    }
  }
}
</style>