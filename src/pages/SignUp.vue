<template>
  <div class="signup-container">
    <div class="signup-inner">
      <div class="signup-header-box">
        <div class="signup-logo">
          <img src="../assets/img/마스코트잔디.png" alt="로고"/>
        </div>
        <h2 class="signup-title">회원가입</h2>
        <div class="rolling-banner-wrap">
          <div class="rolling-banner" :style="{ transform: `translateX(${offset}px)` }" ref="rollingRef">
            <span v-for="(msg, i) in messages" :key="i" class="rolling-item">{{ msg }}</span>
            <!-- 무한루프 위해 한 번 더 붙임 -->
            <span v-for="(msg, i) in messages" :key="'copy'+i" class="rolling-item">{{ msg }}</span>
          </div>
        </div>
      </div>

      <form class="signup-form-box" @submit.prevent="onSignup">
        <div class="form-group email-group">
          <label for="signup-email">이메일</label>
          <input type="email" id="signup-email" placeholder="example@email.com" v-model="email"/>
          <div class="input-msg-list">
            <div class="input-msg">
              <i class="bi bi-x-lg"></i>
              <span>이메일 형식이 올바르지 않습니다</span>
            </div>
          </div>
        </div>

        <div class="form-group password-group">
          <label for="signup-password">비밀번호</label>
          <input type="password" id="signup-password" placeholder="pass0603#" v-model="password"/>
          <div class="input-msg-list">
            <div class="input-msg">
              <i class="bi bi-check-lg"></i>
              <span>영문/숫자/특수문자 중, 2가지 이상 포함</span>
            </div>
            <div class="input-msg">
              <i class="bi bi-check-lg"></i>
              <span>8자 이상 32자 이하 입력 (공백 제외)</span>
            </div>
            <div class="input-msg">
              <i class="bi bi-check-lg"></i>
              <span>연속 3자 이상 동일한 문자/숫자 제외</span>
            </div>
          </div>
        </div>

        <div class="form-group password-check-group">
          <label for="signup-password-check">비밀번호 확인</label>
          <input type="password" id="signup-password-check" placeholder="pass0603#" v-model="passwordCheck"/>
          <div class="input-msg-list">
            <div class="input-msg">
              <i class="bi bi-x-lg"></i>
              <span>비밀번호가 일치하지 않습니다</span>
            </div>
          </div>
        </div>
        <button class="btn-signup" type="submit">가입하기</button>
      </form>

      <div class="signup-sns-box">
        <div class="signup-sns-divider">
          <span>간편 회원가입</span>
        </div>
        <div class="signup-sns-list">
          <a href="#" class="sns-btn kakao">
            <img src="../assets/img/카카오로고.svg" alt="">
          </a>
          <a href="#" class="sns-btn google">
            <img src="../assets/img/구글로고.svg" alt="">
          </a>
        </div>
      </div>

    </div>
  </div>

</template>

<script setup>
/*####### 임포트 #######*/
import {ref, onMounted, onUnmounted} from 'vue';
import { useRouter } from 'vue-router';

/*####### 인풋 관련 v모델 변수들 #######*/
const email = ref('');
const password = ref('');
const passwordCheck = ref('');
const router = useRouter();

/*####### 회원가입 데이터 전송 #######*/
const onSignup = () => {
  // 값 확인
  console.log('이메일:', email.value);
  console.log('비밀번호:', password.value);
  console.log('비밀번호확인:', passwordCheck.value);

  // 여기서 유효성 체크 등 처리
  /* 이메일, 비밀번호가 입력되었는지 검사
  if (!email.value || !password.value || !passwordCheck.value) {
    alert('모든 값을 입력해주세요!');
    return;
  } */

  // 필요 시 이메일, 비밀번호 유효성 검사 후 라우터 이동
  // 현재 페이지 데이터가 다음 페이지로 전달되진 않음 !
  router.push('/email-verify');
};


/*##### 회원가입 텍스트 애니메이션 ######*/
const messages = [
  "이곳에서 성장해 보세요   ",
  "KOKKIRI에서 다양한 학습의 기회를 얻으세요!   ",
  "자신만의 커리어를 만들어보세요   "
];
const offset = ref(0);
const rollingRef = ref(null);

let reqId;
let speed = 0.3; // 1.2px씩 이동

const move = () => {
  if (rollingRef.value) {
    offset.value -= speed;
    // 실제 텍스트 길이의 절반만큼 이동했으면 다시 처음으로
    const totalWidth = rollingRef.value.scrollWidth / 2;
    if (Math.abs(offset.value) >= totalWidth) {
      offset.value = 0;
    }
  }
  reqId = requestAnimationFrame(move);
};

onMounted(() => {
  reqId = requestAnimationFrame(move);
});
onUnmounted(() => {
  cancelAnimationFrame(reqId);
});
</script>

<style scoped>
.rolling-banner-wrap {
  width: 360px;
  overflow: hidden;
  height: 28px;
}

.rolling-banner {
  display: flex;
  align-items: center;
  white-space: nowrap;
  will-change: transform;
}

.rolling-item {
  display: inline-block;
  padding: 0 18px;
  font-size: 16px;
  color: #333333;
  font-weight: 400;
  letter-spacing: -0.3px;
}
</style>