// src/composables/useNotifications.js

import { ref } from 'vue'
import { EventSourcePolyfill } from 'event-source-polyfill'
import axios from 'axios'

// SSE EventSource 인스턴스를 앱 전체에서 하나만 유지하도록 외부에 선언
let eventSource = null

// 컴포저블 외부에서 상태를 선언하여 싱글턴처럼 동작하게 만듭니다.
const notifications = ref([])
const totalUnreadNotifications = ref(0)
const isLoading = ref(false)
const hasMore = ref(true)
const isLogin = ref(false)

/**
 * 알림 데이터 중앙 관리 composable
 * SSE 실시간 알림, 무한 스크롤, 백엔드 API 연동 포함
 */
export function useNotifications() {
    const lastNotificationId = ref(null)
    let reconnectTimeout = null

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

        // 이미 연결이 있다면 종료 후 재연결
        if (eventSource) {
            eventSource.close()
        }
        
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

        eventSource.addEventListener('sse', (event) => {
            console.log("✅ 'sse' 이벤트 수신 성공!")
            try {
                if (!event.data || event.data.trim() === '' || event.data.trim().includes('EventStream Created')) {
                    console.log('📝 데이터가 없는 이벤트 수신 (e.g., keep-alive ping)')
                    return
                }

                const data = JSON.parse(event.data)
                console.log('🔥 [notification 이벤트]:', data)

                notifications.value.unshift({
                    id: data.id, // SSE 데이터에 실제 ID가 있으므로 그것을 사용
                    type: data.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 'etc',
                    message: data.content,
                    datetime: data.actionCreatedAt,
                    isRead: data.isRead === 'Y'
                })

                if (data.isRead === 'N') {
                    totalUnreadNotifications.value += 1
                }
            } catch (e) {
                console.error('❌ 알림 파싱 실패:', e)
                console.error('📋 수신된 원본 데이터:', event.data)
            }
        })

        eventSource.onerror = (err) => {
            console.error('❌ SSE 에러:', err)
            eventSource.close()
            if (!reconnectTimeout) {
                reconnectTimeout = setTimeout(() => {
                    console.log('♻️ SSE 재연결 시도')
                    connectSSE()
                }, 5000) // 재연결 간격
            }
        }
    }

    async function fetchNotifications(isInitial = false) {
        if (isLoading.value || (!isInitial && !hasMore.value)) {
            return
        }

        isLoading.value = true

        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                isLoading.value = false
                return
            }

            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/notification/list`, {
                params: {
                    lastId: isInitial ? null : lastNotificationId.value,
                    size: 10
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const fetchedData = response.data.notifications
            const hasNextPage = response.data.hasNext

            const newNotifications = fetchedData.map(item => ({
                id: item.id,
                type: item.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 'etc',
                message: item.content,
                datetime: item.actionCreatedAt,
                isRead: item.isRead === 'Y'
            }))
            
            if (isInitial) {
                notifications.value = newNotifications
                totalUnreadNotifications.value = response.data.totalUnreadCount
            } else {
                notifications.value.push(...newNotifications)
            }
            
            hasMore.value = hasNextPage

            if (fetchedData.length > 0) {
                lastNotificationId.value = fetchedData[fetchedData.length - 1].id
            }

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
            fetchNotifications(true) // 최초 로드
            connectSSE()
        }
    }

    async function markAllAsRead() {
        try {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/read-all`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            })
            notifications.value.forEach(n => n.isRead = true)
            totalUnreadNotifications.value = 0
            console.log('✅ 모든 알림 읽음 처리 완료')
        } catch (error) {
            console.error('❌ 모든 알림 읽음 처리 실패:', error)
        }
    }

    /**
     * 알림 ID를 기반으로 로컬 상태(배열, 카운트)에서 알림을 제거합니다.
     * @param {string|number} notificationId - 제거할 알림의 ID
     */
    function _removeNotificationFromState(notificationId) {
        const index = notifications.value.findIndex(item => item.id === notificationId);
        if (index !== -1) {
            // 제거하려는 알림이 읽지 않은 상태였다면, 전체 카운트에서 1 감소
            if (!notifications.value[index].isRead) {
                totalUnreadNotifications.value = Math.max(0, totalUnreadNotifications.value - 1);
            }
            // 알림 배열에서 해당 항목 제거
            notifications.value.splice(index, 1);
        }
    }

    /**
     * 일반 알림을 삭제합니다. (초대 알림이 아닌 경우)
     * @param {string|number} notificationId - 삭제할 알림 ID
     */
    async function deleteNotification(notificationId) {
        try {
            // 일반 알림 삭제 API (엔드포인트는 실제 API에 맞게 확인 필요)
            await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/api/notification/${notificationId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            console.log('✅ 알림 삭제 완료');
            // API 성공 시 로컬 상태에서도 제거
            _removeNotificationFromState(notificationId);
        } catch (error) {
            console.error('❌ 알림 삭제 실패:', error);
            // 사용자에게 에러 알림 등을 표시할 수 있습니다.
        }
    }

    
    /**
     * 그룹 채팅 초대를 수락합니다.
     * @param {string|number} invitationId - 수락할 초대(알림) ID
     */
    async function acceptInvitation(invitationId) {
        try {
            // 새로운 API 엔드포인트 사용 (경로 변수로 ID 전달)
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/chat/invitations/${invitationId}/accept`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            console.log('✅ 초대 수락 완료');
            // API 성공 시 로컬 상태에서도 제거
            _removeNotificationFromState(invitationId);
        } catch (error) {
            console.error('❌ 초대 수락 실패:', error);
        }
    }

    /**
     * 그룹 채팅 초대를 거절합니다.
     * @param {string|number} invitationId - 거절할 초대(알림) ID
     */
    async function rejectInvitation(invitationId) {
        try {
            // 새로운 API 엔드포인트 사용 (경로 변수로 ID 전달)
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/chat/invitations/${invitationId}/reject`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            console.log('✅ 초대 거절 완료');
            // API 성공 시 로컬 상태에서도 제거
            _removeNotificationFromState(invitationId);
        } catch (error) {
            console.error('❌ 초대 거절 실패:', error);
        }
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
        totalUnreadNotifications.value = 0
        lastNotificationId.value = null
        isLoading.value = false
        hasMore.value = true
        isLogin.value = false
        cleanup()
    }

    return {
        notifications,
        totalUnreadNotifications,
        isLoading,
        hasMore,
        isLogin,
        formatLocalDateTime,
        initializeNotifications,
        fetchNotifications, // 무한 스크롤을 위해 외부로 노출
        markAllAsRead,
        deleteNotification,
        acceptInvitation,
        rejectInvitation,
        cleanup,
        resetNotifications
    }
}