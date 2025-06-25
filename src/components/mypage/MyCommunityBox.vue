<template>
  <div class="mypage-community-box">
    <div class="community-title-box">
      <span class="community-title">커뮤니티</span>
    </div>
    <div class="community-list">
      <button
          class="community-link"
          @click="$emit('my-posts')"
      >
        <span>내가 쓴 글</span>
      </button>
      <button
          class="community-link"
          @click="$emit('my-comments')"
      >
        <span>댓글 단 글</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

defineEmits([
  'my-posts',
  'my-comments'
])
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.mypage-community-box {
  width: 478px;
  height: 157px;
  border: 1px solid #DDDDDD;
  border-radius: 15px;
  background: $white;

  .community-title-box {
    padding: 25px 0 0 21px;
    margin-bottom: 14px;

    .community-title {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
    }
  }

  .community-list {
    display: flex;
    flex-direction: column;

    .community-link {
      width: 100%;
      height: 48px;
      border: none;
      background: transparent;
      text-align: left;
      cursor: pointer;
      padding: 0 21px;
      transition: background-color 0.2s;

      &:hover {
        background: $light-gray;
      }

      span {
        font-family: $secondary-kr;
        font-weight: 400;
        font-size: 16px;
        line-height: 1.252;
        color: $dark-black;
      }
    }
  }
}
</style>