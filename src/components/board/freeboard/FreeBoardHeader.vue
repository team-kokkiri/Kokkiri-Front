<template>
  <div class="board-free-header">
    <!-- 헤딩 -->
    <div class="board-free-heading">
      <h2 class="board-title">자유게시판</h2>
    </div>

    <!-- 질문 배너 -->
    <div class="board-free-question">
      <img class="icon-question" src="../../../assets/icon/question.png" alt="질문 아이콘"/>
      <div class="question-bubble">
        <span class="question-title">질문에 답변을 달아주세요</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// props나 특별한 로직이 필요하지 않은 정적 헤더 컴포넌트
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
    }

    .question-bubble {
      display: block;
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
  }
}
</style>
