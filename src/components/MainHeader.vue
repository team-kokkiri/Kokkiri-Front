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
                <em class="badge-count">{{totalUnreadNotifications}}</em>
                <button type="button" class="btn-read-all">모두 읽음</button>
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
                      <button class="btn-accept" @click="acceptInvitation(item.id, item.url)">수락</button>
                      <button class="btn-reject" @click="rejectInvitation(item.id)">거절</button>
                    </template>
                    <template v-else>
                      <button class="btn-delete">삭제</button>
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
              <em v-if="hasUnreadChat"></em>
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
  import { ref, watch, nextTick } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { onMounted, onBeforeUnmount } from 'vue'
  import { EventSourcePolyfill } from 'event-source-polyfill';
  import  axios  from 'axios'


  const router = useRouter()
  const route = useRoute()
  const isLogin = ref(false)
  const showNotification = ref(false)
  const notificationRef = ref(null)
  const notifications = ref([])
  const lastNotificationId = ref(null); // 다음 페이지를 가져올 때 사용할 마지막 알림 ID
  const isLoading = ref(false); // 데이터 로딩 중인지 여부
  const hasMore = ref(true); // 더 가져올 데이터가 있는지 여부 (마지막 페이지인지)
  const totalUnreadNotifications = ref(0);
  const hasUnreadChat = ref(false); // 읽지 않은 채팅 알림이 있는지 여부

  // 스크롤 이벤트 리스너를 위한 참조
  const notificationListRef = ref(null);
  let eventSource = null
  let reconnectTimeout = null
  

  // 메뉴 리스트
  const menuList = [
    { name: '게시판', path: '' },
    { name: '캘린더', path: '/calendar' },
    { name: '파티찾기', path: '/party' },
    { name: '공지사항', path: '/notice' },
    { name: '관리자페이지', path: '/admin' }
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

  // SSE 연결
function connectSSE() {
  const token = localStorage.getItem('accessToken')
  
  eventSource = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/api/notification/connect`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  eventSource.onopen = () => {
    console.log('✅ SSE 연결됨')
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
  }

  // onmessage 대신 addEventListener 사용
  eventSource.addEventListener('sse', (event) => { // 'notification'은 서버와 약속된 이벤트 이름으로 변경해야 합니다.
    console.log("✅ 'sse' 이벤트 수신 성공!");
    try {
      // 서버가 보낸 데이터가 JSON 문자열 형태가 아닐 수도 있습니다.
      // 만약 'Last-Event-ID'와 같은 메타 데이터만 온다면 event.data가 비어있을 수 있습니다.
      if (!event.data || event.data.trim() === '') {
          console.log('📝 데이터가 없는 이벤트 수신 (e.g., keep-alive ping)');
          return;
      }

      const data = JSON.parse(event.data);
      console.log('🔥 [notification 이벤트]:', data);

       // ✅ 채팅 알림 여부 업데이트
      if (data.notificationType?.toUpperCase() === 'CHAT') {
        hasUnreadChat.value = true;
      } else {
        notifications.value.unshift({
          id: data.id,
          type: data.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 'etc',
          message: data.content,
          datetime: data.actionCreatedAt,
          isRead: data.isRead
        });
        totalUnreadNotifications.value++;
      }
      
    } catch (e) {
      console.error('❌ 알림 파싱 실패:', e);
      console.error('📋 수신된 원본 데이터:', event.data); // 파싱 실패 시 원본 데이터를 확인하는 것이 중요합니다.
    }
  });

  eventSource.onmessage = (event) => {
    console.log("onmessage 진입");
    console.log("기본 message 이벤트 수신:", event.data);
  }

  eventSource.onerror = (err) => {
    console.error('❌ SSE 에러:', err)
    eventSource.close()
    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(() => {
        console.log('♻️ SSE 재연결 시도')
        connectSSE()
      }, 3000)
    }
  }}

  // 기존 알림 가져오기
  async function fetchNotifications() {
    if (isLoading.value || !hasMore.value) { // 이미 로딩 중이거나 더 이상 데이터가 없으면 요청하지 않음
      return;
    }

    isLoading.value = true;

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        isLoading.value = false;
        return;
      }

      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/notification/list`, {
        params: {
          lastId: lastNotificationId.value, // 처음 로딩 시 빈 값
          size: 10
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // ✅ 백엔드 응답이 NotificationPageResponse 객체이므로, data.notifications에 접근
      const fetchedData = response.data.notifications;
      const hasNextPage = response.data.hasNext; // ✅ 백엔드에서 받은 hasNext 값
      
      console.log(response.data);

      const newNotifications = fetchedData.map(item => ({
        id: item.id,
        type: item.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 'etc',
        message: item.content,
        datetime: item.actionCreatedAt,
        isRead: item.isRead === 'Y'
      }));

      totalUnreadNotifications.value = response.data.totalUnreadCount;
      hasUnreadChat.value = response.data.notifications.some(item => item.notificationType?.toUpperCase() === 'CHAT' && item.isRead === 'N');


       // 새로운 알림을 기존 알림 배열에 추가 (무한 스크롤)
      notifications.value.push(...newNotifications);
      hasMore.value = hasNextPage;

      if (newNotifications.length > 0) { 
        lastNotificationId.value = newNotifications[newNotifications.length - 1].id;
      } 

    } catch (error) {
      console.error('📛 알림 리스트 불러오기 실패:', error)
      // 에러 발생 시 hasMore를 false로 설정하거나 사용자에게 알림
      hasMore.value = false; // 에러 시 더 이상 로드하지 않도록
    } finally {
      isLoading.value = false; // 로딩 상태 해제
    }
  }

  // 스크롤 이벤트 핸들러
  function handleScroll() {
    const element = notificationListRef.value;
    if (!element) return;

    // 스크롤이 거의 끝에 도달했을 때 (예: 하단 100px 이내)
    const isNearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

    if (isNearBottom && !isLoading.value && hasMore.value) {
      fetchNotifications();
    }
  }


  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
    const token = localStorage.getItem('accessToken');
    if (token) {
      isLogin.value = true;
      fetchNotifications(); // 초기 알림 로드
      connectSSE();
    }

    // 알림 드롭다운이 열렸을 때만 스크롤 이벤트 리스너 추가
    watch(showNotification, (newValue) => {
      if (newValue) {
        // 드롭다운이 열리면 리스트 요소에 스크롤 이벤트 리스너 추가
        // nextTick을 사용하여 DOM이 업데이트된 후 접근
        nextTick(() => {
          if (notificationListRef.value) {
            notificationListRef.value.addEventListener('scroll', handleScroll);
          }
        });
      } else {
        // 드롭다운이 닫히면 리스너 제거 (불필요한 이벤트 방지)
        if (notificationListRef.value) {
          notificationListRef.value.removeEventListener('scroll', handleScroll);
        }
      }
    });
  });

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    
    // showNotification watch 내부에서 관리되므로 이 부분은 필요 없을 수도 있음
    if (notificationListRef.value) {
      notificationListRef.value.removeEventListener('scroll', handleScroll);
    }
    if (eventSource) {
      eventSource.close()
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
    }
  })

  // 초대 수락 처리
  async function acceptInvitation(notificationId, chatRoomIdFromUrl) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      // 초대 수락 API 호출
      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/chat/invitations/${notificationId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 알림 목록에서 해당 알림 제거
      notifications.value = notifications.value.filter(item => item.id !== notificationId);
      totalUnreadNotifications.value--; // 알림 개수 감소

      alert('채팅방 초대를 수락했습니다.');

      // 채팅방으로 이동 (알림 URL에서 roomId 추출)
      // 백엔드에서 url 필드에 roomId를 포함시켜 내려준다고 가정
      if (chatRoomIdFromUrl) {
        // URL에서 chatRoomId를 파싱합니다. URL 형식이 '/main-page/chat/{roomId}'라고 가정
        const roomIdMatch = chatRoomIdFromUrl.match(/\/chatPage\/(\d+)/);
        if (roomIdMatch && roomIdMatch[1]) {
          const roomId = roomIdMatch[1];
           router.push(`/chatPage/${roomId}`);
          showNotification.value = false; // 알림 팝업 닫기
        } else {
          console.warn('채팅방 ID를 URL에서 파싱할 수 없습니다:', chatRoomIdFromUrl);
          router.push('/main-page/chat'); // 유효한 roomId가 없으면 기본 채팅 페이지로 이동
          showNotification.value = false; // 알림 팝업 닫기
        }
      } else {
         router.push(`/my/chat/page`); // URL이 없으면 기본 채팅 페이지로 이동
        showNotification.value = false; // 알림 팝업 닫기
      }

    } catch (error) {
      console.error('📛 초대 수락 실패:', error);
      alert('초대 수락에 실패했습니다.');
    }
  }

  // 초대 거절 처리
  async function rejectInvitation(notificationId) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      // 초대 거절 API 호출
      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/chat/invitations/${notificationId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 알림 목록에서 해당 알림 제거
      notifications.value = notifications.value.filter(item => item.id !== notificationId);
      totalUnreadNotifications.value--; // 알림 개수 감소

      alert('채팅방 초대를 거절했습니다.');

    } catch (error) {
      console.error('📛 초대 거절 실패:', error);
      alert('초대 거절에 실패했습니다.');
    }
  }

  function formatLocalDateTime(dateTimeStr) {
      if (!dateTimeStr) return '';
      const date = new Date(dateTimeStr);
      if (isNaN(date)) return '';
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${d} ${h}:${min}`;
    }
  ///////////////////////////////////////////////////////////////////

  // 채팅, 마이페이지 이동
  function goChat() {
    router.push('/main-page/chat')
    hasUnreadChat.value = false; // 채팅 페이지로 이동하면 빨간 점 숨기기
  }
  function goMypage() {
    router.push('/main-page/mypage')
  }
</script>