<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostHeader from '../common/PostHeader.vue'
import PostContent from '../common/PostContent.vue'
import PostReactionBar from '../common/PostReactionBar.vue'
import PostActionBar from '../common/PostActionBar.vue'
import CommentList from './CommentList.vue'
import CommentForm from './CommentForm.vue'
import boardSample from '@/data/boardSample.json'

const route = useRoute()
const router = useRouter()

// 현재 상세 게시글 데이터
const post = ref(null)

// 페이지 진입시 라우터 params.id로 게시글 찾아오기
onMounted(() => {
  const postId = Number(route.params.id)
  post.value = boardSample.find(item => Number(item.id) === postId) || null
})

// 댓글 등록
const onSubmitComment = (commentData) => {
  if (!post.value) return
  if (!post.value.comments) post.value.comments = []
  
  post.value.comments.push({
    id: Date.now(),
    writer: '익명',
    content: commentData.content,
    likeCount: 0,
    createdAt: commentData.createdAt,
    replies: []
  })
  
  post.value.commentCount = (post.value.commentCount || 0) + 1
}

// 게시글 좋아요 (공감) 증가
const onLike = (item = null) => {
  if (item) {
    item.likeCount = (item.likeCount || 0) + 1
  } else if (post.value) {
    post.value.likeCount = (post.value.likeCount || 0) + 1
  }
}

// 스크랩 기능
const onScrap = () => {
  console.log('스크랩 버튼 클릭')
}

// 대댓글 기능
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

<template>
  <div class="board-free-detail">
    <!-- 상세 헤딩 -->
    <div class="detail-heading">
      <h2 class="board-title">자유게시판</h2>
    </div>

    <!-- 게시글 본문 -->
    <div class="detail-post">
      <PostHeader :post="post" @chat="onChat" @report="onReport" />
      <PostContent :post="post" />
      <PostReactionBar :post="post" />
      <PostActionBar @like="onLike" @scrap="onScrap" />
    </div>

    <!-- 댓글 영역 -->
    <div class="detail-comments">
      <CommentList
          :comments="post.comments"
          @reply="onReply"
          @like="onLike"
          @chat="onChat"
          @report="onReport"
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
</template>

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
    height: auto;
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