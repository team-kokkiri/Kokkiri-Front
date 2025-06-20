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
          <input type="text" id="signup-email"
                 placeholder="example@email.com"
                 v-model="email"
                 :class="{ error: !!emailError }"
          />
          <div class="email-code-error" v-if="emailError">
            <i class="bi bi-x-lg"></i>
            <span>{{ emailError }}</span>
          </div>
        </div>

        <div class="form-group password-group">
          <label for="signup-password">비밀번호</label>
          <input
              type="password"
              id="signup-password"
              placeholder="example001"
              v-model="password"
          />
          <div class="input-msg-list">
            <div class="input-msg">
              <i class="bi bi-check-lg"
                 :class="{ 'active': isPasswordMixed }"></i>
              <span :class="{ 'active': isPasswordMixed }">
                영문/숫자/특수문자 중, 2가지 이상 포함
              </span>
            </div>
            <div class="input-msg">
              <i class="bi bi-check-lg"
                 :class="{ 'active': isPasswordLengthValid }"></i>
              <span :class="{ 'active': isPasswordLengthValid }">
                8자 이상 32자 이하 입력 (공백 제외)
              </span>
            </div>
            <div class="input-msg">
              <i class="bi bi-check-lg"
                 :class="{ 'active': isPasswordNoRepeat }"></i>
              <span :class="{ 'active': isPasswordNoRepeat }">
               연속 3자 이상 동일한 문자/숫자 제외
              </span>
            </div>
          </div>
        </div>

        <div class="form-group password-check-group">
          <label for="signup-password-check">비밀번호 확인</label>
          <input
              type="password"
              id="signup-password-check"
              placeholder="example001"
              v-model="passwordCheck"
              :class="{ error: !!passwordCheckError }"
          />
          <div class="input-msg-list">
            <div v-if="passwordCheckError" class="input-msg">
              <i class="bi bi-x-lg"></i>
              <span class="password-check-error">{{ passwordCheckError }}</span>
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
import {ref, onMounted, onUnmounted, computed} from 'vue';
import axios from 'axios';
import {useRouter,useRoute} from 'vue-router';


/*####### 변수들 #######*/
const email = ref('');
const password = ref('');
const passwordCheck = ref('');
const router = useRouter();
const route = useRoute();
const teamCode = ref('');
const nickname = ref('');

/* 에러 메시지 변수 */
const emailError = ref('');
const passwordCheckError = ref('');

import { watch } from 'vue';

onMounted(() => {
  teamCode.value = route.query.teamCode || '';
  if (!teamCode.value) {
    // 팀 코드 없으면 첫 페이지로
    router.push('/classcode');
  }
});

// 이메일 입력이 바뀔 때 에러 즉시 제거
watch(email, () => {
  if (emailError.value) emailError.value = '';
});

// 비밀번호/비밀번호 확인 입력이 바뀔 때 에러 즉시 제거
watch([password, passwordCheck], () => {
  if (passwordCheckError.value) passwordCheckError.value = '';
});

/*####### 회원가입 데이터 전송 #######*/
const onSignup = async () => {
  // 콘솔 체크
  console.log('이메일:', email.value);
  console.log('비밀번호:', password.value);
  console.log('비밀번호확인:', passwordCheck.value);

  // 에러 변수 초기화
  emailError.value = '';
  passwordCheckError.value = '';

  // 이메일 검사
  if (!email.value) {
    emailError.value = '이메일을 입력해주세요.';
  } else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
    emailError.value = '이메일 형식이 올바르지 않습니다.';
  }

  // 비밀번호 확인 비었는지
  if (!passwordCheck.value) {
    passwordCheckError.value = '비밀번호 확인을 입력해주세요.';
  }

  // 비밀번호와 비밀번호 확인값이 다를 때
  else if (password.value !== passwordCheck.value) {
    passwordCheckError.value = '비밀번호가 일치하지 않습니다';
  }

      // 비밀번호 조건 3가지 체크(길이 등)
  // **비밀번호가 비었을 때도 바로 조건문에서 잡도록 추가**
  else {
    let types = 0;
    if (/[A-Za-z]/.test(password.value)) types++;
    if (/[0-9]/.test(password.value)) types++;
    if (/[^A-Za-z0-9]/.test(password.value)) types++;
    const isPasswordMixed = types >= 2;

    const isPasswordLengthValid =
        password.value.length >= 8 &&
        password.value.length <= 32 &&
        !/\s/.test(password.value);

    const isPasswordNoRepeat =
        password.value.length >= 8
            ? !/(.)\1\1/.test(password.value)
            : false;

    if (!password.value) {
      passwordCheckError.value = '비밀번호를 입력해주세요.';
    } else if (!isPasswordMixed || !isPasswordLengthValid || !isPasswordNoRepeat) {
      passwordCheckError.value = '비밀번호 조건을 만족시켜 주세요.';
    }
  }

  // 에러가 하나라도 있으면 함수 종료
  if (emailError.value || passwordCheckError.value) {
    return;
  }

  try {
    // 1) 회원가입 정보 임시 저장
    await axios.post('http://localhost:9090/api/members/signup', {
      email: email.value,
      password: password.value,
      teamCode: teamCode.value,
      nickname: nickname.value,
    });

    // 2) 이메일 인증 코드 발송
    await axios.post('http://localhost:9090/api/email/send', null, {
      params: { email: email.value, type: 'signup' },
    });

    // 3) 인증 페이지로 이동 (email 쿼리 포함)
    router.push({ path: '/email-verify', query: { email: email.value } });
  } catch (error) {
    console.error('회원가입 실패:', error);
    if (error.response?.status === 409) {
      emailError.value = '이미 존재하는 이메일입니다.';
    } else {
      emailError.value = '회원가입에 실패했습니다. 다시 시도해주세요.';
    }
  }
};

/*##### 비밀번호 정규표현식 (css효과) ######*/

// 1. 영문/숫자/특수문자 중 2가지 이상 포함
const isPasswordMixed = computed(() => {
  const pwd = password.value;
  let types = 0;
  if (/[A-Za-z]/.test(pwd)) types++;
  if (/[0-9]/.test(pwd)) types++;
  if (/[^A-Za-z0-9]/.test(pwd)) types++;
  return types >= 2;
});

// 2. 8자 이상 32자 이하, 공백 없음
const isPasswordLengthValid = computed(() => {
  const pwd = password.value;
  return pwd.length >= 8 && pwd.length <= 32 && !/\s/.test(pwd);
});

// 3. 연속 3자 이상 동일 문자/숫자 없음
const isPasswordNoRepeat = computed(() => {
  const pwd = password.value;
  if (pwd.length < 3) return false; // 8자 미만이면 항상 false
  return !/(.)\1\1/.test(pwd); // 3자 이상부터만 검사
});

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