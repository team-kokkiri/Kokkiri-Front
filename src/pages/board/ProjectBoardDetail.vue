<template>
  <!-- 수정 모드 -->
  <PostEditForm 
    v-if="postEditVisible && post"
    :post="post"
    :boardTypeId="post.boardTypeId"
    @submit="onSubmitEdit"
    @cancel="onCancelEdit"
  />
  
  <!-- 일반 상세보기 모드 -->
  <div class="board-free-detail" v-else-if="post">
    <!-- 상세 헤딩 -->
    <div class="detail-heading">
      <h2 class="board-title">프로젝트 소개</h2>
    </div>

    <!-- 게시글 본문 -->
    <div class="detail-post">
      <PostHeader
          :post="post"
          @chat="onChat"
          @report="onReport"
          @edit="onEdit"
          @delete="onDelete"
      />
      <PostContent :post="post" />
      <PostReactionBar :post="post" />
      <PostActionBar
          @like="onLike"
          @scrap="onScrap"
      />
    </div>

    <!-- 댓글/대댓글 리스트 -->
    <div class="detail-comments">
      <CommentList v-if="post.comments && post.comments.length > 0"
          :comments="post.comments || []"
          @reply="onReply"
          @like="onLike"
          @chat="onChat"
          @report="onReport"
          @submit-reply="onSubmitReply"
          @edit="onEdit"
          @submit-edit="onSubmitCommentEdit"
          @delete = "onDelete"
      />
      <CommentForm @submit="onSubmitComment" />
    </div>

    <!-- 하단 버튼 -->
    <div class="detail-footer">
      <button class="btn-back-list" @click="goToList">
        <i class="bi bi-list-ul"></i>
        <span class="text">글 목록</span>
      </button>
    </div>
  </div>
  <div v-else>
    게시글을 찾을 수 없습니다.
  </div>

  <!-- Delete Confirm Modal -->
  <DeleteConfirmModal
    :visible="deleteModalState.visible"
    :message="deleteModalState.message"
    @confirm="handleDeleteConfirm"
    @cancel="hideDeleteModal"
    @close="hideDeleteModal"
  />
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostHeader from '@/components/board/common/PostHeader.vue'
import PostContent from '@/components/board/common/PostContent.vue'
import PostReactionBar from '@/components/board/common/PostReactionBar.vue'
import PostActionBar from '@/components/board/common/PostActionBar.vue'
import CommentList from '@/components/board/detail/CommentList.vue'
import CommentForm from '@/components/board/detail/CommentForm.vue'
import PostEditForm from '@/components/board/detail/PostEditForm.vue'
import DeleteConfirmModal from '@/components/common/modal/DeleteConfirmModal.vue'
import { useDeleteConfirmModal } from '@/composables/useModal.js'

const route = useRoute()
const router = useRouter()
const token = localStorage.getItem('accessToken')
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'

const post = ref(null)
const postEditVisible = ref(false)

// 삭제 모달 상태
const { deleteModalState, showDeleteModal, hideDeleteModal } = useDeleteConfirmModal()
let deleteTarget = null

// 게시글 데이터 불러오기
const fetchPost = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/boards/detail/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    post.value = res.data
    console.log('📌 게시글 API 응답:', res.data)
  } catch (err) {
    console.error('게시글 조회 실패', err)
    post.value = null
  }
}

// 페이지 진입/변경시 게시글 다시 불러오기
onMounted(fetchPost)
watch(() => route.params.id, fetchPost)

// 댓글 등록
const onSubmitComment = async (commentData) => {
  try {
    await axios.post(`${API_BASE_URL}/api/boards/detail/${post.value.id}/comments`, {
      boardId: post.value.id,
      comment: commentData.comment,
      parentId: null
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchPost()
  } catch (err) {
    console.error('댓글 등록 실패', err)
  }
}

// 대댓글 등록
const onSubmitReply = async (replyData) => {
  try {
    await axios.post(`${API_BASE_URL}/api/boards/detail/${post.value.id}/comments`, {
      boardId: post.value.id,
      parentId: replyData.commentId,
      comment: replyData.comment
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchPost()
  } catch (err) {
    console.error('대댓글 등록 실패', err)
  }
}

// 게시글 수정 - 기존 이미지 유지 구현(★)
const onSubmitEdit = async (editData) => {
  if (!post.value) return
  try {
    const formData = new FormData()
    // 기존 이미지 파일 ID 추출 (PostEditForm에서 existingImages 필드 제공 가정)
    const keepFileIds = []
    if (editData.existingImages && editData.existingImages.length > 0) {
      editData.existingImages.forEach(image => {
        if (image.id) keepFileIds.push(image.id)
      })
    }

    // 수정 데이터 조립
    const boardData = {
      boardTitle: editData.boardTitle,
      boardContent: editData.boardContent,
      keepFileIds: keepFileIds   // ★ 기존 파일 유지 ID
    }
    const boardBlob = new Blob([JSON.stringify(boardData)], { type: 'application/json' })
    formData.append('board', boardBlob)

    // 신규 첨부파일 추가
    if (editData.attachedImages && editData.attachedImages.length > 0) {
      editData.attachedImages.forEach(file => {
        formData.append('files', file)
      })
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
        // Content-Type 자동 세팅
      }
    }
    // PUT 수정 요청
    await axios.put(
        `${API_BASE_URL}/api/boards/detail/${post.value.id}`,
        formData,
        config
    )
    postEditVisible.value = false
    await fetchPost()
    alert('게시글이 수정되었습니다.')
  } catch (err) {
    console.error('게시글 수정 실패', err.response?.data || err.message || err)
    alert('게시글 수정에 실패했습니다.')
  }
}

// 댓글 수정
const onSubmitCommentEdit = async (item) => {
  if (!post.value) return
  try {
    await axios.put(
        `${API_BASE_URL}/api/boards/detail/${post.value.id}/comments/${item.id}`,
        { comment: item.content },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    await fetchPost()
  } catch (err) {
    console.error('댓글 수정 실패', err.response?.data || err.message || err)
  }
}

// 좋아요(게시글/댓글)
const onLike = async (item = null) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    if (item) {
      // 댓글/대댓글 좋아요
      await axios.post(
          `${API_BASE_URL}/api/boards/detail/${post.value.id}/comments/${item.id}/like`,
          null,
          config
      )
      item.likeCount = (item.likeCount || 0) + 1
    } else {
      // 게시글 좋아요
      await axios.post(
          `${API_BASE_URL}/api/boards/${post.value.id}/like`,
          null,
          config
      )
      await fetchPost()
    }
  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 500) {
      alert('이미 좋아요를 누르셨습니다.')
    } else {
      console.error('좋아요 실패', err)
    }
  }
}

// 스크랩(추후 구현)
const onScrap = () => {
  console.log('스크랩 버튼 클릭')
}

// 대댓글 폼
const onReply = (comment) => {
  console.log('대댓글 버튼 클릭:', comment)
}

// 게시글/댓글/대댓글 수정 버튼
const onEdit = (item) => {
  if (item === post.value) {
    postEditVisible.value = !postEditVisible.value
  }
}

// 수정 취소
const onCancelEdit = () => {
  postEditVisible.value = false
}

// 삭제 요청 (공통)
const onDelete = (item) => {
  deleteTarget = item
  const message = item === post.value
      ? '정말 게시글을 삭제하시겠습니까?'
      : '정말 댓글을 삭제하시겠습니까?'
  showDeleteModal({ message })
}

// 삭제 확정
const handleDeleteConfirm = async () => {
  if (!deleteTarget) return
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    if (deleteTarget === post.value) {
      await axios.delete(
          `${API_BASE_URL}/api/boards/detail/${post.value.id}`,
          config
      )
      hideDeleteModal()
      await router.push('/main-page/project-board')
    } else {
      await axios.delete(
          `${API_BASE_URL}/api/boards/detail/${post.value.id}/comments/${deleteTarget.id}`,
          config
      )
      hideDeleteModal()
      await fetchPost()
    }
  } catch (err) {
    console.error('삭제 실패', err.response?.data || err.message || err)
    hideDeleteModal()
  } finally {
    deleteTarget = null
  }
}

// 채팅, 신고 기능(구현시 연결)
const onChat = (item) => { console.log('채팅 버튼 클릭:', item) }
const onReport = (item) => { console.log('신고 버튼 클릭:', item) }

// 게시글 목록으로 이동
const goToList = () => {
  router.push('/main-page/project-board')
}
</script>


<style lang="scss" scoped>
@import '@/assets/scss/style';
.board-free-detail {
  width: 832px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  .detail-heading {
    width: 832px;
    height: 60px;
    border: 1px solid #dddddd;

    .board-title {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 22px;
      font-weight: 500;
      color: #333333;
      line-height: 1.2;
      margin: 0;
      padding: 17px 15px;
    }
  }

  .detail-post {
    width: 832px;
    min-height: 232px; /* height를 min-height로 변경 */
    height: auto;
    background-color: #ffffff;
    border: 1px solid #dddddd;
    padding: 15px;
  }

  .detail-comments {
    width: 832px;
    background-color: #ffffff;
    border: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    gap:  10px;
  }

  .detail-footer {
    padding: 0;

    .btn-back-list {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 15px;
      background-color: #ffffff;
      border: 1px solid #fd5631;
      border-radius: 5px;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #fd5631;
      cursor: pointer;
      transition: all 0.2s ease;

      i {
        font-size: 16px;
        color: #fd5631;
      }

      .text {
        line-height: 1.2;
        font-size: 14px;
        color: #fd5631;
      }

      &:hover {
        background-color: #fd5631;
        color: #ffffff;

        i, .text {
          color: #ffffff;
        }
      }
    }
  }

  /* 본문 수정창 스타일 */
  .post-edit {
    margin: 15px 0 0 0 !important;
    background-color: #ffffff !important;
    border: 2px solid #2196f3 !important;
    border-radius: 5px !important;

    .edit-form {
      height: 60px !important;

      .input-edit {
        font-size: 14px !important;
        padding: 20px 15px !important;
      }

      .btn-edit-submit {
        height: 60px !important;
        width: 60px !important;
      }
    }
  }
}
</style>