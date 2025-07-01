<template>
  <div class="post-header">
    <div class="header-avatar">
      <img class="avatar" :src="post.avatarUrl || defaultAvatar" alt="아바타" />
    </div>
    <div class="header-info">
      <span class="nickname">{{ post.writer }}</span>
      <span class="date">{{ formatDate(post.boardCreatedAt) }}</span>
    </div>
    <div class="header-actions">
      <button class="btn-edit" @click="$emit('edit', post)">수정</button>
      <button class="btn-delete" @click="$emit('delete', post)">삭제</button>
      <button class="btn-chat" @click="openChatModal">채팅</button>
      <button class="btn-report" @click="openReportModal">신고</button>
    </div>
  </div>

  <!-- 채팅 초대 모달 -->
  <ChatInviteModal
    :visible="isChatModalOpen"
    :target-nickname="post.writer"
    @confirm="startPrivateChat"
    @cancel="closeChatModal"
    @close="closeChatModal"
  />

  <!-- 신고 모달 -->
  <ReportModal
    :visible="isReportModalOpen"
    :target-id="post.id"
    report-type="POST"
    @close="closeReportModal"
    @success="handleReportSuccess"
  />
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import defaultAvatar from '@/assets/img/0.png'
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ReportModal from '@/components/common/ReportModal.vue'
import ChatInviteModal from '@/components/common/ChatInviteModal.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['chat', 'report', 'edit', 'delete'])

const router = useRouter()
const userStore = useUserStore()

// 날짜 포맷터
function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ----------- 신고 기능 관련 -----------
const isReportModalOpen = ref(false)

function openReportModal() {
  isReportModalOpen.value = true
}

function closeReportModal() {
  isReportModalOpen.value = false
}

function handleReportSuccess() {
  emit('report', props.post.id)
}

// ----------- 1:1 채팅 기능 관련 -----------
const isChatModalOpen = ref(false)

function openChatModal() {
  if (userStore.nickname == props.post.writer) {
    alert("자기 자신과는 채팅할 수 없습니다.")
    return
  }
  isChatModalOpen.value = true
}

function closeChatModal() {
  isChatModalOpen.value = false
}

async function startPrivateChat() {
  if (!props.post.writer) {
    alert("채팅을 시작할 수 없습니다.")
    closeChatModal()
    return
  }
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      alert("로그인이 필요합니다.")
      return
    }
    const response = await axios.post('/api/chat/room/private/create', null, {
      params: {
        otherMemberId: props.post.memberId
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const roomId = response.data
    if (roomId) {
      router.push({ path: '/main-page/chat', query: { roomId } })
    } else {
      alert("채팅방 정보를 가져오지 못했습니다.")
    }
  } catch (error) {
    console.error("1:1 채팅 시작에 실패했습니다:", error)
    const errorMessage = error.response?.data?.message || "채팅방을 시작하는 중 오류가 발생했습니다."
    alert(errorMessage)
  } finally {
    closeChatModal()
  }
}
</script>


<style lang="scss" scoped>
.post-header {
  display: flex;
  align-items: center;

  .header-avatar {
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      object-fit: cover;
    }
  }

  .header-info {
    margin-left: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;

    .nickname {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #333333;
      line-height: 1.2;
    }

    .date {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 12px;
      font-weight: 350;
      color: #999999;
      line-height: 1.2;
    }
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }
}
</style>
