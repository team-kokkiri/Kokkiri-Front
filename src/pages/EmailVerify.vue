<script setup lang="ts">

</script>

<template>
  <div class="email-verification-container">
    <div class="email-verification-inner">
      <div class="email-emoji-box">
        <img src="../assets/img/마스코트잔디.png" alt="코끼리 이모지" />
      </div>
      <div class="email-title">
        <span>인증 메일을 보내드렸어요.</span>
      </div>
      <div class="email-image-box">
        <img src="../assets/img/love-letter.png" alt="메일 일러스트" />
      </div>
      <div class="email-desc-box">
        <div class="email-desc-main">
        <span>메일함을 확인해 주세요.<br>
        인증코드를 입력하셔야<br>
        정상적으로 회원가입이 완료됩니다!</span>
        </div>
      </div>
      <form class="email-code-form">
        <label class="email-code-label">
          <span>인증코드</span>
        </label>
        <div class="email-code-input-wrap">
          <input type="text" class="email-code-input" placeholder="example@email.com" />
        </div>
        <div class="email-code-error">
          <i class="bi bi-x-lg"></i>
          <span>인증코드가 올바르지 않습니다</span>
        </div>
        <div class="email-submit-box">
          <button type="submit" class="btn-email-submit">이메일 인증하기</button>
        </div>
      </form>
    </div>
  </div>

</template>

<style scoped>

</style>