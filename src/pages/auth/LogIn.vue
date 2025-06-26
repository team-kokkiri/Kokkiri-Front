<template>
  <div class="login-container">
    <div class="login-inner">
      <!-- 상단 로고+서비스명 -->
      <div class="login-header-box">
        <img class="login-logo" src="../../assets/img/로그인로고.png" alt="로고" />
      </div>

      <!-- 본문 영역 -->
      <form class="login-main-box" @submit.prevent="handleLogin">
        <!-- 아이디/비밀번호 입력 박스 -->
        <div class="login-field-box">
          <input
              type="email"
              v-model="email"
              placeholder="아이디"
              autocomplete="username"
          />
          <input
              type="password"
              v-model="password"
              placeholder="비밀번호"
              autocomplete="current-password"
          />
        </div>

        <!-- 에러 메시지 출력 영역 -->
        <div class="input-msg-list" style="margin-bottom:12px;">
          <div v-if="errorMessage" class="input-msg">
            <i class="bi bi-x-lg"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <div class="login-button">
          <button class="btn-login" type="submit">KOKKIRI 로그인</button>
        </div>

        <!-- 하단 링크 -->
        <div class="login-link-box">
          <router-link class="login-join" to="/teamcode-verify">회원가입</router-link>
          <router-link class="login-find" to="/find-password">비밀번호 찾기</router-link>
        </div>
      </form>

      <!-- 구분선 + 간편로그인 -->
      <div class="login-divider">
        <span>간편 로그인</span>
        <div class="easy-login-box">
          <a :href="'http://localhost:9090/oauth2/authorization/kakao'" class="sns-btn kakao">
            <img src="../../assets/img/카카오로고.svg" alt="카카오" />
          </a>
          <a :href="'http://localhost:9090/oauth2/authorization/google'" class="sns-btn google">
            <img src="../../assets/img/구글로고.svg" alt="구글" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/*####### 임포트 #######*/
import { ref } from 'vue';
import axios from '../../utils/axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user'


/*####### 변수들 #######*/
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const userStore = useUserStore()

/*####### 로그인 데이터 전송 #######*/
const handleLogin = async () => {
  errorMessage.value = '';
  try {
    const response = await axios.post('/api/members/login', {
      email: email.value,
      password: password.value,
    });

    // 리프래시토큰만 쿠키로 저장
    const accessToken = response.data.accessToken;
    const userEmail = response.data.email;
    const role = response.data.role;
    const avatar = response.data.avatar;

    // 피니아 로그인 메소드 사용
    await userStore.login({
      tokenData: {
        email: userEmail,
        role: role,
        avatar: avatar
      },
      token: accessToken
    })

    await router.push('/main-page');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = '아이디 또는 비밀번호가 일치하지 않습니다.';
    } else {
      errorMessage.value = '로그인 중 오류가 발생했습니다.';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ######### LogIn-Page ##########*/
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-inner {
    width: 360px;
    height: 446px;
    margin: 0 auto;

    .login-header-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 48px;
      margin-right: 25px;
      .logo {
        width: 191px;
        height: 56px;
      }
    }
    .login-main-box {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 4px;

      .login-field-box {
        display: flex;
        flex-direction: column;
        gap: 4px;

        input[type="email"],
        input[type="password"] {
          width: 100%;
          height: 44px;
          border: none;
          border-radius: 15px;
          background: #f5f5f5;
          padding: 0 18px;
          font-size: 16px;
          color: $dark-black;
          outline: none;
          box-sizing: border-box;

          &::placeholder {
            color: $light-black;
            font-size: 16px;
          }
          &:focus {
            border: 2px solid $main-color;
            background: white;
          }
          &:focus::placeholder {
            color: white;
          }
        }
      }

      .input-msg-list {
        height: 20px;
        .input-msg {
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-left: 4px;
          margin-top: 4px;
          font-weight: 400;
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
      }

      .login-button {
        margin-top: 4px;
        button.btn-login {
          width: 100%;
          height: 44px;
          background: $main-color;
          border: none;
          border-radius: 15px;
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.15s;

          &:hover {
            opacity: 0.8;
          }
          &:active {
            opacity: 1;
          }
        }
      }

      .login-link-box {
        display: flex;
        justify-content: space-between;
        padding: 10px;

        a {
          font-size: 14px;
          color: #777;
          text-decoration: none;
          transition: color 0.1s;

          &:hover {
            color: $main-color;
          }
          &:active {
            transform: translateY(2px);
          }
        }
      }
    }

    // 구분선 + 간편로그인
    .login-divider {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 28px 0 0 0;

      // 구분선 + 텍스트
      span {
        color: #999999;
        font-size: 14px;
        font-weight: 400;
        margin: 0 0 14px 0;
        position: relative;
        width: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        &::before,
        &::after {
          content: "";
          flex: 1 0 0;
          height: 1px;
          background: #e5e5e5;
          border-radius: 1px;
        }
        &::before {
          margin-right: 12px;
        }
        &::after {
          margin-left: 12px;
        }
      }

      .easy-login-box {
        display: flex;
        gap: 16px;
        margin-top: 4px;

        a {
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
        // 배경색
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
</style>
