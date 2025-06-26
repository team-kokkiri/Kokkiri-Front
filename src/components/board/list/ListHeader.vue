<template>
  <div class="board-free-header">
    <!-- 헤딩 -->
    <div class="board-free-heading">
      <h2 class="board-title">자유게시판</h2>
    </div>

    <!-- 질문 배너 -->
    <div class="board-free-question" v-if="questionPosts.length > 0">
      <img class="icon-question" src="../../../assets/icon/question.png" alt="질문 아이콘"/>
      <div class="question-content">
        <div class="question-list">
          <div 
            v-for="question in questionPosts.slice(0, 10)"
            :key="question.id"
            class="question-item"
            @click="$emit('questionClick', question.id)"
          >
            <span class="question-title">
              {{ question.boardTitle.length > 10
                            ? question.boardTitle.slice(0, 10) + '...'
                            : question.boardTitle }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// props 정의
defineProps({
  questionPosts: {
    type: Array,
    default: () => []
  }
})

// 이벤트 정의
defineEmits(['questionClick'])

</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';
.board-free-header {
  margin-bottom: 5px;

  .board-free-heading {
    border: 1px solid $dim-gray;
    padding: 14px 17px;

    .board-title {
      font-size: 22px;
      font-weight: 500;
      color: $dark-black;
      margin: 0;
    }
  }

  .board-free-question {
    max-height: 75px;
    min-height: 75px;
    display: flex;
    align-items: center;
    padding: 19px 24px;
    border: 1px solid $dim-gray;
    gap: 8px;

    .icon-question {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .question-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .question-bubble {
      background: rgba(0, 210, 211, 0.1);
      border-radius: 15px;
      padding: 12px;
      min-height: 44px;
      max-height: 44px;
      max-width: 100%;
      box-sizing: border-box;
      
      /* 한 줄 처리 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .question-title {
        font-size: 12px;
        color: #686868;
      }
    }

    .question-list {
      display: flex;
      flex-direction: row;
      gap: 8px;
      max-height: 37px;
      overflow: hidden;
      
      .question-item {
        display: flex;
        align-items: center;
        justify-content:  center;
        cursor: pointer;
        padding: 15px 12px;
        border-radius: 15px;
        background-color: rgba(0, 210, 211, 0.1);
        
        .question-title {
          font-size: 12px;
          color: #333333;
          font-weight: 500;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        
        .question-meta {
          font-size: 10px;
          color: #888888;
        }
      }
    }
  }
}
</style>
