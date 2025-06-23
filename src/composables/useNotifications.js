// src/composables/useNotifications.js
import { ref } from 'vue'
import { EventSourcePolyfill } from 'event-source-polyfill'
import axios from 'axios'

/**
 * 알림 데이터 중앙 관리 composable
 * SSE 실시간 알림, 무한 스크롤, 백엔드 API 연동 포함
 */
export function useNotifications() {
    // 알림 상태
    const notifications = ref([])
    const totalUnreadNotifications = ref(0)
    const lastNotificationId = ref(null)
    const isLoading = ref(false)
    const hasMore = ref(true)
    const isLogin = ref(false)

    // SSE 관련
    let eventSource = null
    let reconnectTimeout = null

    /**
     * 날짜 포맷팅 함수
     * @param {string} dateTimeStr - 날짜 문자열
     * @returns {string} 포맷된 날짜 문자열
     */
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

    /**
     * SSE 연결 설정
     */
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

        // SSE 이벤트 수신
        eventSource.addEventListener('sse', (event) => {
            console.log("✅ 'sse' 이벤트 수신 성공!")
            try {
                if (!event.data || event.data.trim() === '') {
                    console.log('📝 데이터가 없는 이벤트 수신 (e.g., keep-alive ping)')
                    return
                }

                const data = JSON.parse(event.data)
                console.log('🔥 [notification 이벤트]:', data)

                // 새 알림을 배열 맨 앞에 추가
                notifications.value.unshift({
                    id: `sse-${Date.now()}`,
                    type: data.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 'etc',
                    message: data.content,
                    datetime: data.actionCreatedAt,
                    isRead: data.isRead
                })

                // 읽지 않은 알림 수 업데이트
                if (!data.isRead) {
                    totalUnreadNotifications.value += 1
                }
            } catch (e) {
                console.error('❌ 알림 파싱 실패:', e)
                console.error('📋 수신된 원본 데이터:', event.data)
            }
        })

        eventSource.onmessage = (event) => {
            console.log("onmessage 진입")
            console.log("기본 message 이벤트 수신:", event.data)
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
        }
    }

    /**
     * 기존 알림 목록 가져오기 (무한 스크롤 지원)
     */
    async function fetchNotifications() {
        if (isLoading.value || !hasMore.value) {
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
                    lastId: lastNotificationId.value,
                    size: 10
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const fetchedData = response.data.notifications
            const hasNextPage = response.data.hasNext

            console.log(response.data)

            const newNotifications = fetchedData.map(item => ({
                id: item.id,
                type: item.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 'etc',
                message: item.content,
                datetime: item.actionCreatedAt,
                isRead: item.isRead === 'Y'
            }))

            totalUnreadNotifications.value = response.data.totalUnreadCount
            console.log("totalUnreadNotifications.value: " + totalUnreadNotifications.value)

            // 새로운 알림을 기존 알림 배열에 추가 (무한 스크롤)
            notifications.value.push(...newNotifications)
            hasMore.value = hasNextPage

            if (newNotifications.length > 0) {
                lastNotificationId.value = newNotifications[newNotifications.length - 1].id
            }

        } catch (error) {
            console.error('📛 알림 리스트 불러오기 실패:', error)
            hasMore.value = false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * 스크롤 이벤트 핸들러 생성
     * @param {HTMLElement} element - 스크롤을 감지할 요소
     * @returns {Function} 스크롤 이벤트 핸들러
     */
    function createScrollHandler(element) {
        return function handleScroll() {
            if (!element) return

            // 스크롤이 거의 끝에 도달했을 때 (예: 하단 100px 이내)
            const isNearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100

            if (isNearBottom && !isLoading.value && hasMore.value) {
                fetchNotifications()
            }
        }
    }

    /**
     * 알림 시스템 초기화
     */
    function initializeNotifications() {
        const token = localStorage.getItem('accessToken')
        if (token) {
            isLogin.value = true
            fetchNotifications()
            connectSSE()
        }
    }

    /**
     * 모든 알림을 읽음 처리
     */
    async function markAllAsRead() {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) return

            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/read-all`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // 로컬 상태 업데이트
            notifications.value.forEach(notification => {
                notification.isRead = true
            })
            totalUnreadNotifications.value = 0

            console.log('✅ 모든 알림 읽음 처리 완료')
        } catch (error) {
            console.error('❌ 모든 알림 읽음 처리 실패:', error)
        }
    }

    /**
     * 특정 알림 삭제
     * @param {string|number} notificationId - 삭제할 알림 ID
     */
    async function deleteNotification(notificationId) {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) return

            await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/api/notification/${notificationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // 로컬 상태에서 제거
            const index = notifications.value.findIndex(item => item.id === notificationId)
            if (index !== -1) {
                const deletedNotification = notifications.value[index]
                notifications.value.splice(index, 1)

                // 읽지 않은 알림이었다면 카운트 감소
                if (!deletedNotification.isRead) {
                    totalUnreadNotifications.value = Math.max(0, totalUnreadNotifications.value - 1)
                }
            }

            console.log('✅ 알림 삭제 완료')
        } catch (error) {
            console.error('❌ 알림 삭제 실패:', error)
        }
    }

    /**
     * 초대 수락 처리
     * @param {string|number} notificationId - 수락할 초대 알림 ID
     */
    async function acceptInvitation(notificationId) {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) return

            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/invitation/accept`, {
                notificationId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log('✅ 초대 수락 완료')
            // 수락 후 해당 알림 삭제
            deleteNotification(notificationId)
        } catch (error) {
            console.error('❌ 초대 수락 실패:', error)
        }
    }

    /**
     * 초대 거절 처리
     * @param {string|number} notificationId - 거절할 초대 알림 ID
     */
    async function rejectInvitation(notificationId) {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) return

            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/notification/invitation/reject`, {
                notificationId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log('✅ 초대 거절 완료')
            // 거절 후 해당 알림 삭제
            deleteNotification(notificationId)
        } catch (error) {
            console.error('❌ 초대 거절 실패:', error)
        }
    }

    /**
     * 알림 시스템 정리 (컴포넌트 언마운트 시 호출)
     */
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

    /**
     * 알림 데이터 초기화 (로그아웃 시 등)
     */
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
        // 상태
        notifications,
        totalUnreadNotifications,
        isLoading,
        hasMore,
        isLogin,

        // 메서드
        formatLocalDateTime,
        initializeNotifications,
        fetchNotifications,
        createScrollHandler,
        markAllAsRead,
        deleteNotification,
        acceptInvitation,
        rejectInvitation,
        cleanup,
        resetNotifications
    }
}