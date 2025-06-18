<script setup lang="ts">

</script>

<template>
  <div class="signup-container">
    <div class="signup-inner">

      <div class="signup-header-box">
        <div class="signup-logo">
          <img src="로고이미지경로" alt="로고" />
        </div>
        <h2 class="signup-title">회원가입</h2>
        <p class="signup-desc">가입 안내 문구</p>
      </div>

      <div class="signup-form-box">
        <div class="form-group email-group">
          <label for="signup-email">이메일</label>
          <input type="email" id="signup-email" />
          <div class="input-msg-list">
            <div class="input-msg">
              <img src="아이콘" alt="" />
              <span>이메일 안내/오류 메시지</span>
            </div>
          </div>
        </div>

        <div class="form-group nickname-group">
          <label for="signup-nickname">닉네임</label>
          <input type="text" id="signup-nickname" />
          <div class="input-msg-list">
            <div class="input-msg">
              <img src="아이콘" alt="" />
              <span>닉네임 안내 메시지</span>
            </div>
            <div class="input-msg">
              <img src="아이콘" alt="" />
              <span>닉네임 오류 메시지</span>
            </div>
          </div>
        </div>

        <div class="form-group password-group">
          <label for="signup-password">비밀번호</label>
          <input type="password" id="signup-password" />
          <div class="input-msg-list">
            <div class="input-msg">
              <img src="아이콘" alt="" />
              <span>8자 이상</span>
            </div>
            <div class="input-msg">
              <img src="아이콘" alt="" />
              <span>영문/숫자/특수문자 포함</span>
            </div>
            <div class="input-msg">
              <img src="아이콘" alt="" />
              <span>비밀번호 안내 메시지</span>
            </div>
          </div>
        </div>

        <div class="form-group password-check-group">
          <label for="signup-password-check">비밀번호 확인</label>
          <input type="password" id="signup-password-check" />
          <div class="input-msg-list">
            <div class="input-msg">
              <img src="아이콘" alt="" />
              <span>비밀번호 일치 안내</span>
            </div>
          </div>
        </div>

        <div class="form-group classcode-group">
          <label for="signup-classcode">클래스 코드</label>
          <input type="text" id="signup-classcode" />
        </div>

        <button class="btn-signup" type="button">가입하기</button>
      </div>

      <div class="signup-sns-box">
        <div class="signup-sns-divider">
          <span>또는 SNS 계정으로 가입</span>
        </div>
        <div class="signup-sns-list">
          <a href="#" class="sns-btn kakao">카카오로 가입</a>
          <a href="#" class="sns-btn google">구글로 가입</a>
        </div>
      </div>

    </div>
  </div>

</template>

<style scoped>

</style>