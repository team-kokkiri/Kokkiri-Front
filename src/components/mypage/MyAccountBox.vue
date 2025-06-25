<template>
  <div class="mypage-account-box">
    <div class="account-title-box">
      <span class="account-title">계정</span>
    </div>
    <div class="account-list">
      <button
          class="account-link"
          @click="$emit('nickname-change')"
      >
        <span>닉네임 변경</span>
      </button>
      <button
          class="account-link"
          @click="$emit('password-change')"
      >
        <span>비밀번호 변경</span>
      </button>
      <button
          class="account-link"
          @click="$emit('class-code-change')"
      >
        <span>반 코드 변경</span>
      </button>
      <button
          class="account-link"
          @click="$emit('account-delete')"
      >
        <span>회원 탈퇴</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

defineEmits([
  'nickname-change',
  'password-change',
  'class-code-change',
  'account-delete'
])
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.mypage-account-box {
  width: 478px;
  height: 253px;
  border: 1px solid #DDDDDD;
  border-radius: 15px;
  background: $white;

  .account-title-box {
    padding: 25px 0 0 21px;
    margin-bottom: 14px;

    .account-title {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
    }
  }

  .account-list {
    display: flex;
    flex-direction: column;

    .account-link {
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