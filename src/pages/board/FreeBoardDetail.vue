<template>
  <div class="board-free-detail" v-if="post">
    <!-- 상세 헤딩 -->
    <div class="detail-heading">
      <h2 class="board-title">자유게시판</h2>
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
          @submit-edit="onSubmitEdit"
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
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostHeader from '@/components/board/common/PostHeader.vue'
import PostContent from '@/components/board/common/PostContent.vue'
import PostReactionBar from '@/components/board/common/PostReactionBar.vue'
import PostActionBar from '@/components/board/common/PostActionBar.vue'
import CommentList from '@/components/board/detail/CommentList.vue'
import CommentForm from '@/components/board/detail/CommentForm.vue'
//import EditForm from '@/components/board/detail/EditForm.vue'
// import boardSample from '@/data/boardSample.json'


const route = useRoute()
const router = useRouter()
const token = localStorage.getItem('accessToken');
// API 기본 URL (환경 변수 사용 권장)
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

// 현재 상세 게시글 데이터
const post = ref(null)

// 본문 수정 입력창 상태 관리
const postEditVisible = ref(false)

// 페이지 진입시 라우터 params.id로 게시글 찾아오기
const fetchPost = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/boards/detail/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    post.value = res.data
  } catch (err) {
    console.error('게시글 조회 실패', err)
    post.value = null
  }
}

// 페이지 진입시 라우터
onMounted(() => {
  fetchPost()
})

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

    await fetchPost()  // 댓글 등록 후 전체 게시글 다시 불러오기
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

    await fetchPost() // 대댓글 등록 후 전체 게시글 다시 불러오기
  } catch (err) {
    console.error('대댓글 등록 실패', err)
  }
}

// 수정 등록 핸들러 (백엔드 처리 해야함)
const onSubmitEdit = async (item) => {
  if (!post.value) return
  console.log(item)
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    // item이 게시글인지, 댓글인지, 대댓글인지 구분
    if (item === post.value) {
      // 게시글 수정
    } else {
      // 댓글 수정
      await axios.put(
          `${API_BASE_URL}/api/boards/detail/${post.value.id}/comments/${item.id}`,
          {
            comment: item.content
          },
          config
      )
      await fetchPost()
    }
  } catch (err) {
    console.error('수정 실패', err.response?.data || err.message || err);
  }
}

// 게시글 좋아요 (공감) 증가
const onLike = async (item = null) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    if (item) {
      // 댓글, 답글
      await axios.post(
        `${API_BASE_URL}/api/boards/detail/${post.value.id}/comments/${item.id}/like`,
        null,
        config
      )
      item.likeCount = (item.likeCount || 0) + 1
    } else {
      // 게시글
      await axios.post(
        `${API_BASE_URL}/api/boards/${post.value.id}/like`,
        null,
        config
      )
      await fetchPost()
    }
  } catch (err) {
    if (err.response?.status === 400) {
      alert('이미 좋아요를 누르셨습니다.')
    } else {
      console.error('좋아요 실패', err)
    }
  }
}

// 스크랩 기능
const onScrap = () => {
  console.log('스크랩 버튼 클릭')
}

// 대댓글 기능 (CommentList에서 처리)
const onReply = (comment) => {
  console.log('대댓글 버튼 클릭:', comment)
}

// 수정 기능
const onEdit = async (item) => {
  // 본문 수정 버튼인지 검증하고, 열려있으면 닫고 닫혀있으면 여는 기능
  if (item === post.value) {
    postEditVisible.value = !postEditVisible.value
  }
}

// 삭제 기능 // 본문 댓글 대댓글 전부 이 메소드로 합쳤는데 필요하면 나눠드림
// 타입으로 구분해서 처리하면 될 듯 합니다
const onDelete = async (item) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const confirmMessage = item === post.value
        ? '게시글을 삭제하시겠습니까?'
        : '댓글을 삭제하시겠습니까?'

    if (!confirm(confirmMessage)) {
      return // 사용자가 취소하면 함수 종료
    }

    // item이 게시글인지, 댓글인지, 대댓글인지 구분
    if (item === post.value) {
      // 게시글 삭제
      await axios.delete(
          `${API_BASE_URL}/api/boards/detail/${post.value.id}`,
          config
      )
      await router.push('/main-page/free-board')
    } else {
      // 댓글 대댓글 삭제
      await axios.delete(
          `${API_BASE_URL}/api/boards/detail/${post.value.id}/comments/${item.id}`,
          config
      )
      await fetchPost()
    }
  } catch (err) {
    console.error('삭제 실패', err.response?.data || err.message || err);
  }
}

// 채팅 기능
const onChat = (item) => {
  console.log('채팅 버튼 클릭:', item)
}

// 신고 기능
const onReport = (item) => {
  console.log('신고 버튼 클릭:', item)
}

// 글 목록 이동
const goToList = () => {
  router.push('/main-page/free-board')
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