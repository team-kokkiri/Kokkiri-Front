<template>
  <div class="mainpage-header">
    <div class="header-inner">
      <div class="header-row">
        <div class="header-left">
          <img src="../../assets/img/메인페이지로고.png" alt="로고" @click = "goMain"/>
        </div>
        <div class="header-center">
          <div v-for="menu in menuList" :key="menu.name" class="gnb-menu-item" :class="{ active: activeMenu === menu.name }" @click="handleMenuClick(menu)">
            <div class="menu-content">
              <img v-if="menu.name === '순위'" src="@/assets/img/crown.png" alt="왕관" class="crown-icon" />
              <span class="menu-text">{{ menu.name }}</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="util-icon-item">
            <button type="button" class="icon-btn" @click="toggleNotification">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/></svg>
              <span class="red-dot" v-if="totalUnreadNotifications > 0"></span>
            </button>
            <div v-if="showNotification" class="notification-dropdown" ref="notificationRef">
              <div class="notification-header">
                <h3 class="title">알림</h3>
                <button type="button" class="btn-read-all" @click="handleMarkAllAsReadClick">모두 읽음</button>
              </div>
              <div class="notification-list" ref="notificationListRef">
                <template v-if="notifications.length > 0">
                  <div class="notification-item"
                       v-for="item in notifications"
                       :key="item.id"
                       @click="handleNotificationClick(item)"
                       :class="{ 'clickable': item.url && item.type !== 'invite' }">
                    <!-- 'invite' 타입일 때만 item-mark를 표시하도록 v-if 추가 -->
                    <div v-if="item.type === 'invite'" class="item-mark invite"></div>
                    <div class="item-content">
                      <p class="message">{{ item.message }}</p>
                      <span class="datetime">{{ formatLocalDateTime(item.datetime) }}</span>
                    </div>
                    <div class="btn-action-wrap">
                      <template v-if="item.type === 'invite'">
                        <button class="btn-accept" @click.stop="handleAcceptClick(item)">수락</button>
                        <button class="btn-reject" @click.stop="handleRejectClick(item)">거절</button>
                      </template>
                      <template v-else>
                        <button class="btn-delete" @click.stop="handleDeleteClick(item.id)">삭제</button>
                      </template>
                    </div>
                  </div>
                </template>
                <div v-if="isLoading" class="loading-indicator">알림을 불러오는 중...</div>
                <div v-if="notifications.length === 0 && !isLoading" class="no-data">새로운 알림이 없습니다.</div>
              </div>
            </div>
          </div>
          <div class="util-icon-item">
            <button type="button" class="icon-btn" @click="goChat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16"><path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/></svg>
              <span class="red-dot" v-if="hasNewChatMessage"></span>
            </button>
          </div>
          <div class="util-icon-item">
             <button type="button" class="icon-btn" @click="goMypage">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 초대 수락 확인 모달 -->
  <div v-if="showAcceptModal" class="modal-overlay" @click.self="closeAcceptModal">
    <div class="modal-content">
      <p class="modal-text">
        <strong>'{{ invitationRoomName }}'</strong> 방에 참여하시겠습니까?
      </p>
      <div class="modal-actions">
        <button class="btn-modal btn-confirm" @click="confirmAcceptInvitation">네</button>
        <button class="btn-modal btn-cancel" @click="closeAcceptModal">아니오</button>
      </div>
    </div>
  </div>

  <!-- 초대 거절 확인 모달 -->
  <div v-if="showRejectModal" class="modal-overlay" @click.self="closeRejectModal">
    <div class="modal-content">
      <p class="modal-text">
        <strong>'{{ rejectionRoomName }}'</strong> 초대를 거절하시겠습니까?
      </p>
      <div class="modal-actions">
        <button class="btn-modal btn-confirm" @click="confirmRejectInvitation">네</button>
        <button class="btn-modal btn-cancel" @click="closeRejectModal">아니오</button>
      </div>
    </div>
  </div>
  
  <!-- '모두 읽음' 확인 모달 -->
  <NotificationDeleteModal
    :visible="showMarkAllAsReadModal"
    @confirm="confirmMarkAllAsRead"
    @cancel="closeMarkAllAsReadModal"
    @close="closeMarkAllAsReadModal"
  />

  <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
    <div class="modal-content">
      <p class="modal-text">
        이 알림을 삭제하시겠습니까?
      </p>
      <div class="modal-actions">
        <button class="btn-modal btn-confirm" @click="confirmDelete">네</button>
        <button class="btn-modal btn-cancel" @click="closeDeleteModal">아니오</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed, defineProps, defineEmits } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNotifications } from '@/composables/useNotifications';
import { useUserStore } from '@/stores/user';
import NotificationDeleteModal from './modal/NotificationDeleteModal.vue';

const props = defineProps({
  notifications: Array,
  totalUnreadNotifications: Number,
  isLoading: Boolean,
  hasMore: Boolean,
  hasNewChatMessage: Boolean,
});

const emit = defineEmits([
  'deleteNotification',
  'markAllAsRead',
  'acceptInvitation',
  'rejectInvitation',
  'fetchMoreNotifications',
  'markChatAsRead',
]);

const {
  notifications,
  hasNewChatMessage,
  totalUnreadNotifications,
  isLoading,
  hasMore,
  formatLocalDateTime,
  fetchNotifications,
  markChatAsRead,
  markAllAsRead,
  deleteNotification,
  acceptInvitation,
  rejectInvitation,
  handleNotificationClick,
} = useNotifications(props, emit);


const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const showNotification = ref(false);
const notificationRef = ref(null);
const notificationListRef = ref(null);

const showAcceptModal = ref(false);
const notificationToAccept = ref(null);

const showRejectModal = ref(false);
const notificationToReject = ref(null);

const showMarkAllAsReadModal = ref(false);

const showDeleteModal = ref(false);
const notificationIdToDelete = ref(null);

const invitationRoomName = computed(() => {
  if (!notificationToAccept.value) return '';
  const message = notificationToAccept.value.message;
  const match = message.match(/<([^>]+)>/);
  return match && match[1] ? match[1] : '해당';
});

const rejectionRoomName = computed(() => {
  if (!notificationToReject.value) return '';
  const message = notificationToReject.value.message;
  const match = message.match(/<([^>]+)>/);
  return match && match[1] ? match[1] : '해당';
});

// 기본 메뉴 리스트
const baseMenuList = [
  { name: '게시판', path: '' }, 
  { name: '캘린더', path: '/calendar' }, 
  { name: '일일문제', path: '/daily-problem' }, 
  { name: '순위', path: '/daily-ranking' },
  { name: '공지사항', path: '/notice' }
];

// 관리자 메뉴
const adminMenu = { name: '관리자페이지', path: '/admin' };

// 사용자 권한에 따른 동적 메뉴 리스트
const menuList = computed(() => {
  const menus = [...baseMenuList];
  if (userStore.isAdmin) {
    menus.push(adminMenu);
  }
  return menus;
});

const activeMenu = ref('게시판');
watch(() => route.path, (newPath) => {
    const found = menuList.value.find(menu => `/main-page${menu.path}` === newPath);
    if (found) activeMenu.value = found.name;
}, { immediate: true });

function handleMenuClick(menu) {
  activeMenu.value = menu.name;
  router.push(`/main-page${menu.path}`);
}

function toggleNotification() {
  showNotification.value = !showNotification.value;
}

function handleClickOutside(event) {
  if (showNotification.value && notificationRef.value && !notificationRef.value.contains(event.target)) {
    showNotification.value = false;
  }
}

function goChat() {
  markChatAsRead(); 
  router.push('/main-page/chat');
}

function goMypage() {
  router.push('/main-page/mypage');
}

function goMain() {
  router.push('/main-page');
}

// 수락 관련 함수
function handleAcceptClick(item) {
  notificationToAccept.value = item;
  showAcceptModal.value = true;
}
function closeAcceptModal() {
  showAcceptModal.value = false;
  notificationToAccept.value = null;
}
async function confirmAcceptInvitation() {
  if (notificationToAccept.value) {
    await acceptInvitation(notificationToAccept.value);
  }
  closeAcceptModal();
}

// 거절 관련 함수
function handleRejectClick(item) {
  notificationToReject.value = item;
  showRejectModal.value = true;
}
function closeRejectModal() {
  showRejectModal.value = false;
  notificationToReject.value = null;
}
async function confirmRejectInvitation() {
  if (notificationToReject.value) {
    await rejectInvitation(notificationToReject.value);
  }
  closeRejectModal();
}

// 모두 읽음 관련 함수
function handleMarkAllAsReadClick() {
  showMarkAllAsReadModal.value = true;
}
function closeMarkAllAsReadModal() {
  showMarkAllAsReadModal.value = false;
}
async function confirmMarkAllAsRead() {
  await markAllAsRead();
  closeMarkAllAsReadModal();
}

// 삭제 관련 함수
function handleDeleteClick(id) {
  notificationIdToDelete.value = id;
  showDeleteModal.value = true;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
  notificationIdToDelete.value = null;
}
async function confirmDelete() {
  if (notificationIdToDelete.value) {
    await deleteNotification(notificationIdToDelete.value);
  }
  closeDeleteModal();
}


let scrollHandler = null;

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  watch(showNotification, (newValue) => {
    if (newValue) {
      nextTick(() => {
        const listEl = notificationListRef.value;
        if (listEl) {
          scrollHandler = () => {
            const isNearBottom = listEl.scrollHeight - listEl.scrollTop <= listEl.clientHeight + 100;
            if (isNearBottom && !isLoading.value && hasMore.value) {
              fetchNotifications();
            }
          };
          listEl.addEventListener('scroll', scrollHandler);
        }
      });
    } else {
      const listEl = notificationListRef.value;
      if (listEl && scrollHandler) {
        listEl.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
      }
    }
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  const listEl = notificationListRef.value;
  if (listEl && scrollHandler) {
    listEl.removeEventListener('scroll', scrollHandler);
  }
});
</script>

<style lang="scss" scoped>
/* red-dot 스타일 */
.red-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 1px solid white;
}

@import '@/assets/scss/style';

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 320px;
}
.modal-text {
  font-size: 16px;
  margin: 0 0 20px;
  color: #333;
  line-height: 1.5;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.btn-modal {
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 80px;
}
.btn-confirm {
  background-color: $main-color;
  color: white;
  &:hover {
    background-color: darken($main-color, 10%);
  }
}
.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
}

/* 전체 헤더 스타일 */
.mainpage-header {
  width: 100%;
  height: 80px;
  min-width: 1180px;
  min-height: 80px;
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid $dim-gray;
  .header-inner {
    width: 1180px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
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
          height: 80px;
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
        
        .menu-content {
        display: flex;
        align-items: center;
        gap: 6px;
          
          .crown-icon {
            width: 20px;
            height: 20px;
            object-fit: contain;
            margin-top: 2px;
          }
        
          .menu-text {
            font-size: 16px;
          font-weight: bold;
            color: $dark-black;
              transition: color 0.2s;
              }
            }
            
            &.active {
              border-bottom: 5px solid $main-color;
              padding-top: 10px;
            }
            
            &:hover .menu-content .menu-text {
              color: $main-color;
            }
            
            &.active .menu-content .menu-text {
              color: $main-color
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
          
          .icon-btn {
            display: flex;
            align-items: center;
            position: relative;
            font-size: 24px;
            background: white;
            border: none;
            .bi.bi-bell-fill { width: 20px; height: 20px; fill: white; stroke: $dark-black; stroke-width: 1.5px; }
            .bi.bi-chat-dots-fill { width: 20px; height: 20px; fill: $dim-black; }
            .bi.bi-person-fill { width: 24px; height: 24px; fill: $dim-black; }
          }
          
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

            .notification-header {
              display: flex;
              align-items: center;
              border-bottom: 1px solid $dim-gray;
              padding: 0 27px;
              height: 80px;
              flex-shrink: 0;
              h3.title {
                font-size: 24px;
                font-weight: normal;
                color: $dark-black;
                margin: 0;
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
            
            .notification-list {
              flex: 1;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              &::-webkit-scrollbar { width: 8px; }
              &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 8px; }

              .notification-item {
                display: flex;
                align-items: center;
                min-height: 60px;
                height: 80px;
                border-bottom: 1px solid $dim-gray;
                flex-shrink: 0;
                box-sizing: border-box;
                position: relative;
                
                &:last-child { border-bottom: none; }
                
                &.clickable {
                  cursor: pointer;
                  &:hover { background-color: #f8f9fa; }
                }

                .item-mark {
                  width: 15px;
                  height: 70px;
                  background: $orangered;
                  flex-shrink: 0;
                  border: none;
                }

                .item-content {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  margin: 0 12px;
                  p.message {
                    font-size: 16px;
                    font-weight: 500;
                    color: $dark-black;
                    margin: 0 0 4px 0;
                    line-height: 1.4;
                  }
                  span.datetime {
                    font-size: 12px;
                    color: $dim-black;
                    font-weight: normal;
                  }
                }

                .btn-action-wrap {
                  position: absolute;
                  right: 18px;
                  bottom: 10px;
                  display: flex;
                  
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

              .no-data, .loading-indicator {
                margin: auto;
                color: #888;
                font-size: 14px;
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
