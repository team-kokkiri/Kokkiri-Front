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
      <CommentList
          :comments="post.comments || []"
          @reply="onReply"
          @like="onLike"
          @chat="onChat"
          @report="onReport"
          @submit-reply="onSubmitReply"
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


const route = useRoute()
const router = useRouter()

// 현재 상세 게시글 데이터
const post = ref(null)

// 페이지 진입시 라우터 params.id로 게시글 찾아오기
// onMounted(() => {
//   const postId = Number(route.params.id)
//   post.value = boardSample.find(item => Number(item.id) === postId) || null
// })

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:9090/api/boards/${route.params.id}`)
    post.value = res.data
  } catch (err) {
    console.error('게시글 조회 실패', err)
    post.value = null
  }
})


// 댓글 등록 (백엔드 처리 해야함)
// const onSubmitComment = (commentData) => {
//   if (!post.value) return
//   if (!post.value.comments) post.value.comments = []

//   post.value.comments.push({
//     id: Date.now(),
//     writer: '익명',
//     content: commentData.content,
//     likeCount: 0,
//     createdAt: commentData.createdAt,
//     replies: []
//   })

//   post.value.commentCount = (post.value.commentCount || 0) + 1
// }

const onSubmitComment = async (commentData) => {
  try {
    const res = await axios.post(`http://localhost:9090/api/boards/detail/${post.value.id}/comments`, {
      boardId: post.value.id,
      content: commentData.content
    })
    // 성공 시 새 댓글 추가
    post.value.comments.push(res.data)
    post.value.commentCount++
  } catch (err) {
    console.error('댓글 등록 실패', err)
  }
}

// 대댓글 등록 (백엔드 처리 해야함)
// const onSubmitReply = (replyData) => {
//   if (!post.value) return

//   const targetComment = post.value.comments.find(c => c.id === replyData.commentId)
//   if (!targetComment) return

//   if (!targetComment.replies) targetComment.replies = []

//   targetComment.replies.push({
//     id: Date.now(),
//     writer: '익명',
//     content: replyData.content,
//     likeCount: 0,
//     createdAt: replyData.createdAt
//   })
// }

const onSubmitReply = async (replyData) => {
  try {
    const res = await axios.post(`http://localhost:9090/api/boards/detail/${post.value.id}/comments`, {
      boardId: post.value.id,
      parentId: replyData.commentId,
      content: replyData.content
    })
    const targetComment = post.value.comments.find(c => c.id === replyData.commentId)
    if (targetComment) {
      if (!targetComment.replies) targetComment.replies = []
      targetComment.replies.push(res.data)
    }
  } catch (err) {
    console.error('대댓글 등록 실패', err)
  }
}

// 게시글 좋아요 (공감) 증가
// const onLike = (item = null) => {
//   if (item) {
//     item.likeCount = (item.likeCount || 0) + 1
//   } else if (post.value) {
//     post.value.likeCount = (post.value.likeCount || 0) + 1
//   }
// }

const onLike = async (item = null) => {
  try {
    if (item) {
      // 댓글 or 답글 좋아요
      await axios.post(`http://localhost:9090/api/comments/${item.id}/like`)
      item.likeCount++
    } else {
      // 게시글 좋아요
      await axios.post(`http://localhost:9090/api/boards/${post.value.id}/like`)
      post.value.likeCount++
    }
  } catch (err) {
    console.error('좋아요 실패', err)
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
    height: 232px;
    background-color: #ffffff;
    border: 1px solid #dddddd;
    padding: 15px;
  }

  .detail-comments {
    width: 832px;
    background-color: #ffffff;
    border: 1px solid #dddddd;
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
}
</style>