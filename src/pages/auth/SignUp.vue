<template>
  <div class="signup-container">
    <div class="signup-inner">
      <div class="signup-header-box">
        <div class="signup-logo">
          <img src="../../assets/img/마스코트잔디.png" alt="로고"/>
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
          <a :href="`http://localhost:9090/oauth2/authorization/kakao?state=${encodeURIComponent(state)}`" class="sns-btn kakao">
            <img src="../../assets/img/카카오로고.svg" alt="">
          </a>
          <a :href="`http://localhost:9090/oauth2/authorization/google?state=${encodeURIComponent(state)}`" class="sns-btn google">
            <img src="../../assets/img/구글로고.svg" alt="">
          </a>
        </div>
      </div>
    </div>

    <!-- Loading Modal -->
    <LoadingModal
      :visible="loadingModalState.visible"
      :message="loadingModalState.message"
      :sub-message="loadingModalState.subMessage"
    />
  </div>

</template>

<script setup>
/*####### 임포트 #######*/
import {ref, onMounted, computed, watch, onUnmounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import LoadingModal from '@/components/common/LoadingModal.vue';
import { useLoadingModal } from '@/composables/useModal.js';

/*####### 변수들 #######*/
const email = ref('');
const password = ref('');
const passwordCheck = ref('');

// [추가] 이전 페이지에서 전달받은 state 값을 저장할 변수
// const teamCode = ref('');
const state = ref('');

const router = useRouter();
const route = useRoute();

// Loading Modal 상태 관리
const { loadingModalState, showLoadingModal, hideLoadingModal } = useLoadingModal();

/* 에러 메시지 변수 */
const emailError = ref('');
const passwordCheckError = ref('');

// [수정] onMounted 로직을 state 기반으로 전면 수정
onMounted(() => {
  // URL 쿼리 파라미터에서 state 값을 읽어옵니다.
  const queryState = route.query.state;

  // state 값이 없으면 비정상적인 접근으로 간주하고, 팀 코드 인증 페이지로 리다이렉트합니다.
  if (!queryState) {
    router.push('/teamcode-verify');
    return;
  }

  // 가져온 state 값을 컴포넌트의 state 변수에 저장합니다.
  state.value = queryState;
  console.log('페이지에 전달된 state:', state.value);
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
    // [수정] 회원가입 요청 시 세션 대신 'state' 값을 함께 전송합니다.
    await axios.post('/api/members/signup', {
      email: email.value,
      password: password.value,
      state: state.value,       // 이 state 값을 통해 백엔드는 Redis에서 teamCode를 찾습니다.
    });

    // Loading Modal 표시
    showLoadingModal({
      message: '인증 메일을 발송중입니다',
      subMessage: '잠시만 기다려주세요!'
    });

    // 이메일 인증 코드 발송 요청
    await axios.post('/api/email/send', null, {
      params: { email: email.value, type: 'signup' },
    });

    // 로딩 모달 숨기기
    hideLoadingModal();

    // 인증 페이지로 이동 (email 쿼리 포함)
    router.push({ path: '/email-verify', query: { email: email.value } });

  } catch (error) {
    // 에러 시 로딩 모달 숨기기
    hideLoadingModal();
    
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
  const queryState = route.query.state;
  if (!queryState) {
    router.push('/teamcode-verify');
    return;
  }
  state.value = queryState;
  reqId = requestAnimationFrame(move);
});

onUnmounted(() => {
  cancelAnimationFrame(reqId);
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ######### SignUp-Page ##########*/
.signup-container {
  width: 100% !important;
  height: 100vh !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #fff; /* 디버깅용 */
  
  .signup-inner {
    width: 360px !important;
    height: auto; /* height를 auto로 변경 */
    min-height: 800px;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    padding: 20px;
    border-radius: 10px;
    
    .signup-header-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      
      .signup-logo {
        margin-bottom: 14px;
        img {
          width: 56px;
          height: 56px;
          object-fit: contain;
        }
      }
      .signup-title {
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 12px;
        color: $dark-black;
      }
    }
    
    .signup-form-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 25px;
      
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .email-code-error {
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-left: 4px;
          margin-top: 4px;
          font-weight: 430;
          
          .bi {
            font-size: 14px;
            margin-right: 5px;
            color: $crimson;
          }
          span {
            line-height: 1.5;
            color: $crimson;
          }
        }

        label {
          font-size: 16px;
          font-weight: 500;
          color: $dark-black;
          margin-bottom: 4px;
        }

        input[type="text"],
        input[type="password"] {
          width: 100% !important;
          height: 50px !important;
          padding: 0 14px !important;
          border: 1px solid $dark-gray !important;
          border-radius: 10px !important;
          font-size: 18px !important;
          transition: border-color 0.2s;
          outline: none;
          box-sizing: border-box !important;
          background: white;
          
          &:focus {
            border: 2px solid $main-color !important;
            background: white;
          }
          &:focus::placeholder {
            color: white;
          }
          &::placeholder {
            color: $light-black;
            font-size: 16px;
          }
          &.error {
            border: 1px solid $crimson !important;
            color: $crimson;
          }
          &.error::placeholder {
            color: $crimson;
          }
          &.error:focus {
            border: 2px solid $crimson !important;
          }
          &.error:focus::placeholder {
            color: white;
          }
        }

        .input-msg-list {
          min-height: 20px;
          display: flex;
          flex-direction: column;
          gap: 2px;

          .input-msg {
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-left: 2px;
            font-weight: 430;

            .bi {
              font-size: 14px;
              margin-right: 5px;
              color: $dark-gray;
            }
            .bi.bi-x-lg {
              color: $crimson;
            }
            span {
              line-height: 1.5;
              color: $dark-gray;
            }
            .password-check-error {
              line-height: 1.5;
              color: $crimson;
            }
            .bi.active,
            span.active {
              color: $forestgreen;
            }
          }
        }
      }
    }

    .btn-signup {
      width: 100% !important;
      height: 50px !important;
      border-radius: 15px;
      background: $main-color !important;
      color: white !important;
      font-size: 18px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 20px;
      
      &:hover {
        opacity: 0.8;
      }
    }

    .signup-sns-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;

      .signup-sns-divider {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        span {
          color: #999999;
          font-size: 14px;
          font-weight: 400;
          margin: 0 14px;
          white-space: nowrap;
        }

        // 좌우 라인
        &::before,
        &::after {
          content: "";
          flex: 1 0 0;
          height: 1px;
          background: #e5e5e5;
          border-radius: 1px;
        }
      }

      .signup-sns-list {
        display: flex;
        gap: 16px;

        .sns-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
          transition: box-shadow 0.1s, transform 0.1s;

          img {
            width: 20px;
            height: 20px;
            object-fit: contain;
          }

          &:hover {
            box-shadow: 0 4px 8px rgba(34, 153, 248, 0.12);
            transform: translateY(-2px) scale(1.06);
          }

          &:active {
            transform: translateY(2px);
          }
        }
        
        // 개별 배경색
        .kakao {
          background: #ffd43b;
        }
        .google {
          background: #eeeeee;
        }
      }
    }
  }
}

/* 롤링 배너 스타일 */
.rolling-banner-wrap {
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  height: 28px;
  margin-bottom: 20px;
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