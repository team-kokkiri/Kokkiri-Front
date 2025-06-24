import { ref, computed } from 'vue'
import { EventSourcePolyfill } from 'event-source-polyfill'
import axios from 'axios'
import { useRouter } from 'vue-router'

// SSE EventSource 인스턴스를 앱 전체에서 하나만 유지하도록 외부에 선언
let eventSource = null

// 컴포저블 외부에서 상태를 선언하여 싱글턴처럼 동작하게 만듭니다.
const notifications = ref([])
const hasNewChatMessage = ref(false)
const isLoading = ref(false)
const hasMore = ref(true)
const isLogin = ref(false)
const notificationVersion = ref(0)

const totalUnreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.isRead).length
})

/**
 * 알림 데이터 중앙 관리 composable
 * SSE 실시간 알림, 무한 스크롤, 백엔드 API 연동 포함
 */
export function useNotifications() {
    const router = useRouter()
    const lastNotificationId = ref(null)
    let reconnectTimeout = null

    function forceUpdate() {
        notificationVersion.value += 1;
    }

    function formatLocalDateTime(dateTimeStr) {
        if (!dateTimeStr) return ''
        const date = new Date(dateTimeStr)
        if (isNaN(date)) return ''
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        return `${y}-${m}-${d} ${h}:${min}`
    }

    function connectSSE() {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        if (eventSource) eventSource.close()
        
        eventSource = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/api/notification/connect`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        eventSource.onopen = () => console.log('✅ SSE 연결됨')

        eventSource.addEventListener('sse', (event) => {
            try {
                if (!event.data || event.data.trim().includes('EventStream Created')) return
                const data = JSON.parse(event.data)
                const type = data.notificationType?.toUpperCase();

                console.log(data);
                if (type === 'CHAT') {
                    if (!hasNewChatMessage.value) {
                        hasNewChatMessage.value = true;
                        forceUpdate(); // 상태 변경 후 강제 업데이트 신호
                    }
                    return; 
                }
                
                notifications.value.unshift({
                    id: data.id,
                    type: type === 'INVITATION' ? 'invite' : 'etc',
                    message: data.content,
                    datetime: data.actionCreatedAt,
                    invitationId: data.invitationId,
                    isRead: data.isRead === 'Y'
                })
                if (data.isRead === 'N') {
                    totalUnreadNotifications.value += 1
                    forceUpdate();
                }
            } catch (e) {
                console.error('❌ 알림 파싱 실패:', e, '원본 데이터:', event.data)
            }
        })
        eventSource.onerror = (err) => console.error('❌ SSE 에러:', err)
    }

    async function fetchNotifications(isInitial = false) {
        if (isLoading.value || (!isInitial && !hasMore.value)) return
        isLoading.value = true
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) { isLoading.value = false; return; }
            
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/notification/list`, {
                params: { lastId: isInitial ? null : lastNotificationId.value, size: 10 },
                headers: { Authorization: `Bearer ${token}` }
            })

            const { notifications: fetchedData, hasNext, totalUnreadCount } = response.data
            const hasUnreadChat = fetchedData.some(item => item.notificationType?.toUpperCase() === 'CHAT' && item.isRead === 'N');
            if (hasUnreadChat) hasNewChatMessage.value = true;
            
            const nonChatNotifications = fetchedData.filter(item => item.notificationType?.toUpperCase() !== 'CHAT');
            const newNotifications = nonChatNotifications.map(item => ({
                id: item.id, type: item.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 'etc',
                message: item.content, datetime: item.actionCreatedAt, invitationId: item.invitationId, isRead: item.isRead === 'Y'
            }))
            
            if (isInitial) {
                notifications.value = newNotifications
                const unreadChatCountInPage = fetchedData.filter(item => item.notificationType?.toUpperCase() === 'CHAT' && item.isRead === 'N').length;
                totalUnreadNotifications.value = Math.max(0, totalUnreadCount - unreadChatCountInPage);
            } else {
                notifications.value.push(...newNotifications)
            }
            hasMore.value = hasNext
            if (nonChatNotifications.length > 0) {
                lastNotificationId.value = nonChatNotifications[nonChatNotifications.length - 1].id
            }
            forceUpdate();
        } catch (error) {
            console.error('📛 알림 리스트 불러오기 실패:', error)
        } finally {
            isLoading.value = false
        }
    }
    
    function initializeNotifications() {
        const token = localStorage.getItem('accessToken')
        if (token) {
            isLogin.value = true
            fetchNotifications(true)
            connectSSE()
        }
    }

    function markChatAsRead() {
        if (!hasNewChatMessage.value) return;

        // 먼저 UI에서 즉시 빨간 점을 끕니다.
        hasNewChatMessage.value = false;

        // 새로 만든 '채팅 알림 모두 읽음' API를 호출합니다.
        axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/read/chat`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
        .then(() => {
            console.log('✅ 서버의 채팅 알림들이 성공적으로 읽음 처리되었습니다.');
        })
        .catch(error => {
            console.error('❌ 채팅 알림 읽음 처리 API 호출에 실패했습니다:', error);
            // 실패 시 다시 빨간 점을 켤 수도 있습니다.
            hasNewChatMessage.value = true;
        });
    }

    async function markAllAsRead() {
       try {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/read-all`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            })
            // 성공적으로 API가 호출되면, 모든 알림의 isRead 상태를 true로 변경
            notifications.value.forEach(n => n.isRead = true)
        } catch (error) { console.error('❌ 모든 알림 읽음 처리 실패:', error) }
    }

    function _removeNotificationFromState(notificationId) {
        notifications.value = notifications.value.filter(item => item.id !== notificationId)
    }

    async function deleteNotification(notificationId) {
        try {
            await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/api/notification/${notificationId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            })
            _removeNotificationFromState(notificationId)
        } catch (error) { console.error('❌ 알림 삭제 실패:', error) }
    }
    
    async function acceptInvitation(notification) {
        try {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/chat/invitations/${notification.invitationId}/accept`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            })
            _removeNotificationFromState(notification.id)
            if (response.data && response.data.roomId) {
              router.push(`/main-page/chat?roomId=${response.data.roomId}`)
            }
        } catch (error) { console.error('❌ 초대 수락 실패:', error) }
    }

    async function rejectInvitation(notification) {
        try {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/chat/invitations/${notification.invitationId}/reject`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            })
            _removeNotificationFromState(notification.id)
        } catch (error) { console.error('❌ 초대 거절 실패:', error) }
    }

    function cleanup() {
        if (eventSource) {
            eventSource.close()
            eventSource = null
        }
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout)
            reconnectTimeout = null 
        }
    }

    function resetNotifications() {
        notifications.value = []
        hasNewChatMessage.value = false
        totalUnreadNotifications.value = 0
        lastNotificationId.value = null
        isLoading.value = false
        hasMore.value = true
        isLogin.value = false
        cleanup()
    }

    return {
        notifications,
        hasNewChatMessage,
        totalUnreadNotifications,
        isLoading,
        hasMore,
        isLogin,
        notificationVersion,
        formatLocalDateTime,
        initializeNotifications,
        fetchNotifications,
        markAllAsRead,
        markChatAsRead,
        deleteNotification,
        acceptInvitation,
        rejectInvitation,
        cleanup,
        resetNotifications
    }
}