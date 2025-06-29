import { ref } from 'vue' // ✨ computed를 import 목록에서 삭제
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
const totalUnreadNotifications = ref(0)
const isChatPageActive = ref(false);

/**
 * 알림 데이터 중앙 관리 composable
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

                if (type === 'CHAT') {
                    if (!hasNewChatMessage.value) { hasNewChatMessage.value = true; forceUpdate(); }
                    return; 
                }
                
                notifications.value.unshift({
                    id: data.id,
                    type: type === 'INVITATION' ? 'invite' : 'etc',
                    message: data.content,
                    datetime: data.actionCreatedAt,
                    invitationId: data.invitationId,
                    url: data.url || null
                })
                totalUnreadNotifications.value += 1
                forceUpdate();
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
            const hasUnreadChat = fetchedData.some(item => item.notificationType?.toUpperCase() === 'CHAT' && item.delYn === 'N'); // isRead 대신 delYn으로 확인 (필요시)
            if (hasUnreadChat) hasNewChatMessage.value = true;
            
            const nonChatNotifications = fetchedData.filter(item => item.notificationType?.toUpperCase() !== 'CHAT');
            const newNotifications = nonChatNotifications.map(item => ({
                id: item.id,
                type: item.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 'etc',
                message: item.content,
                datetime: item.actionCreatedAt,
                invitationId: item.invitationId,
                url: item.url || null
            }))
            
            if (isInitial) {
                notifications.value = newNotifications
                // totalUnreadCount는 이제 채팅 알림을 제외한 카운트라고 가정
                totalUnreadNotifications.value = totalUnreadCount; 
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

    async function markChatAsRead() {
        // 이미 빨간 점이 없는 상태면 함수를 실행X
        if (!hasNewChatMessage.value) {
            return;
        }
        
        // UI를 먼저 변경하여 사용자에게 즉각적인 피드백
        hasNewChatMessage.value = false;

        try {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/read-chat`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });

        } catch (error) {
            console.error('❌ 채팅 알림 읽음 처리 API 호출 실패:', error);
            hasNewChatMessage.value = true;
        }
    }

    async function markAllAsRead() {
       try {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/read-all`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            })
            notifications.value = [];
            totalUnreadNotifications.value = 0;
            hasMore.value = false;
            forceUpdate();
        } catch (error) { console.error('❌ 모든 알림 삭제 처리 실패:', error) }
    }

    function _removeNotificationFromState(notificationId) {
        const notificationToRemove = notifications.value.find(item => item.id === notificationId);
        if (notificationToRemove) {
            totalUnreadNotifications.value = Math.max(0, totalUnreadNotifications.value - 1);
        }
        notifications.value = notifications.value.filter(item => item.id !== notificationId)
    }

    async function deleteNotification(notificationId) {
        try {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/delete/${notificationId}`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            })
            _removeNotificationFromState(notificationId)
        } catch (error) { console.error('❌ 알림 삭제 실패:', error) }
    }
    
    async function acceptInvitation(notification) {
    try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/chat/invitations/${notification.invitationId}/accept`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        _removeNotificationFromState(notification.id);
        
        // roomId를 받아 채팅방으로 직접 라우팅합니다.
        if (response.data && response.data.roomId) {
          router.push({ path: '/main-page/chat', query: { roomId: response.data.roomId } });
        }
    } catch (error) { console.error('❌ 초대 수락 실패:', error); }
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
        if (eventSource) { eventSource.close(); eventSource = null; }
        if (reconnectTimeout) { clearTimeout(reconnectTimeout); reconnectTimeout = null; }
    }

    function resetNotifications() {
        notifications.value = [];
        hasNewChatMessage.value = false;
        totalUnreadNotifications.value = 0;
        lastNotificationId.value = null;
        isLoading.value = false;
        hasMore.value = true;
        isLogin.value = false;
        cleanup();
    }

    async function fetchChatRoomMembers(roomId, page = 0, size = 20) {
        if (!roomId) {
            console.error("채팅방 ID가 없어 멤버를 조회할 수 없습니다.");
            return null; // Page 객체 구조를 위해 null 반환
        }
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error("인증 토큰이 없습니다.");
                return null;
            }
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/chat/room/${roomId}/members`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, size } // ✨ page와 size를 파라미터로 전달
            });
            return response.data; // ✨ 백엔드에서 보낸 PageResponseDto 객체 전체를 반환
        } catch (error) {
            console.error(`채팅방(${roomId}) 멤버 조회 실패:`, error);
            return null;
        }
    }


    return {
        notifications, hasNewChatMessage, totalUnreadNotifications, isLoading, hasMore, isLogin, notificationVersion,
        formatLocalDateTime, initializeNotifications, fetchNotifications, markAllAsRead, markChatAsRead,
        deleteNotification, acceptInvitation, rejectInvitation, cleanup, resetNotifications, isChatPageActive, fetchChatRoomMembers
    }
}