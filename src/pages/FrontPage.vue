<template>
  <div class="container front">
    <div class="layout-wrap">
      <aside class="side-bar">
        <div class="side-content">
          <div class="side-content-wrap">
            <div class="side-logo">
              <img src="../assets/img/kosa로고2.jpg" alt="" />
            </div>
            <div class="side-login-box">
              <router-link class="btn-login" to="/login">로그인</router-link>
              <router-link class="btn-signup" to="/teamcode-verify">KOSA 회원가입</router-link>
              <router-link class="find-account" to="/find-password">비밀번호 찾기</router-link>
              <hr />
            </div>
          </div>
          <div class="side-member-list-box">
            <div class="side-member-header">
              <span class="side-member-title">KOSA 소속 회원사</span>
              <div class="side-member-search">
                <input type="text" placeholder="회원사 검색" v-model="companySearch" />
                <i class="bi bi-search"></i>
              </div>
            </div>
            <div class="side-member-list">
              <a
                  class="side-member-item"
                  v-for="(company, idx) in filteredCompanyList"
                  :key="idx"
                  :href="company.url"
                  target="_blank" rel="noopener"
              >
                <span class="company-name">{{ company.name }}</span>
                <i class="bi bi-arrow-up-right-square"></i>
              </a>
            </div>
          </div>
        </div>
      </aside>
      <main class="main-content">
        <section class="main-section main-hero">
          <div class="main-hero-inner">
            <div class="main-hero-content-box">
              <div class="main-hero-left">
                <h1 class="main-hero-title">KOSA 끼리 논다,<br>KOKKIRI</h1>
                <p class="main-hero-desc">
                  KOSA 커뮤니티에서 학생들과 함께<br />
                  여러분이 원하는 생활을 만들어보세요.
                </p>
                <div class="main-hero-download">
                  <a class="btn appstore" href="https://www.apple.com/kr/app-store/" target="_blank">
                    <img src="../assets/img/icon_appstore.svg" alt="App Store" class="appstore-logo" />
                    <img src="../assets/img/logo_appstore.svg" alt="App Store Text" class="appstore-text" />
                  </a>
                  <a class="btn googleplay" href="https://play.google.com/store/apps?hl=ko" target="_blank">
                    <img src="../assets/img/icon_playstore.svg" alt="Google Play" class="googleplay-logo" />
                    <img src="../assets/img/logo_playstore.svg" alt="Google Play Text" class="googleplay-text" />
                  </a>
                </div>
              </div>
              <div class="main-hero-right">
                <img
                    ref="mascotRef"
                    :class="['main-hero-elephant', { show: isVisible }]"
                    src="../assets/img/마스코트잔디.png"
                    alt="코끼리"
                />
              </div>
            </div>
          </div>
        </section>
        <section class="main-section main-platform">
          <div class="main-platform-inner">
            <div class="platform-title-wrap">
              <h2 class="platform-title">소프트웨어 인재를 위한<br/>커뮤니티 플랫폼</h2>
              <p class="platform-desc">
                전국 SW 교육생과 교수님들이 함께하는<br/>
                지식 교류 공간, KOKKIRI
              </p>
            </div>
            <div class="platform-feature-list">
              <template v-for="(item, idx) in platformFeatureList" :key="item.title">
                <div
                    class="platform-feature-item"
                    :ref="el => setItemRefs(el, idx)"
                >
                  <div class="feature-icon-wrap">
                    <img :src="item.icon" :alt="item.title" />
                  </div>
                  <div class="feature-desc-wrap">
                    <h3 class="feature-title">{{ item.title }}</h3>
                    <p class="feature-count">
                      <span class="number">{{ displayNumbers[idx].toLocaleString() }}</span>
                      <span class="unit">{{ item.unit }}</span>
                    </p>
                  </div>
                </div>
                <i v-if="idx !== platformFeatureList.length - 1" class="bi bi-dash-lg vertical-divider"></i>
              </template>
            </div>
          </div>
        </section>
        <section class="main-section main-community">
          <div class="main-community-inner">
            <!-- 좌측: 커뮤니티 정보 & 게시판 미리보기 -->
            <div class="community-left">
              <div class="community-info-wrap">
                <div class="community-icon">
                  <i class="bi bi-chat-text-fill"></i>
                </div>
                <div class="community-title-wrap">
                  <h2 class="community-title">KOSA 수강생들을 위한<br>소통공간</h2>
                  <p class="community-desc">
                    KOSA 커뮤니티 KOKKIRI 에서<br>
                    수강생들과 자유롭게 얘기하세요
                  </p>
                </div>
              </div>
              <div class="community-board-wrap" ref="boardWrapRef">
                <img src="../assets/img/커뮤게시판.png" alt="커뮤니티 게시판 샘플">
                <div class="board-popup board-popup-main" ref="popupMainRef" :class="{ 'show': isPopupMainVisible }">
                  <img src="../assets/img/본문게시글사진.jpg" alt="">
                </div>
                <div class="board-popup board-popup-comment" ref="popupCommentRef" :class="{ 'show': isPopupCommentVisible }">
                  <img src="../assets/img/댓글사진.jpg" alt="">
                </div>
              </div>
            </div>

            <!-- 우측: 과정별 커뮤니티 소개 -->
            <div class="community-right">
              <div class="community-type-box">
                <div class="community-type-info-wrap">
                  <h3 class="community-type-title">회원전용 커뮤니티</h3>
                  <p class="community-type-desc">
                    프로젝트 소개, 자유게시판 등<br>
                    회원을 위한 여러가지 게시판이 마련되어 있어요!
                  </p>
                </div>
                <div class="community-type-list">
                  <div class="community-type-item">
                    <div class="type-icon">
                      <i class="bi bi-lock-fill"></i>
                    </div>
                    <div class="type-info-wrap">
                      <h4 class="type-title">수강생 인증</h4>
                      <p class="type-desc">과정별 인증 시스템으로<br>맞춤 커뮤니티를 이용할 수 있어요</p>
                    </div>
                  </div>
                  <div class="community-type-item">
                    <div class="type-icon">
                      <i class="bi bi-people-fill"></i>
                    </div>
                    <div class="type-info-wrap">
                      <h4 class="type-title">자유로운 운영</h4>
                      <p class="type-desc">수강생이 자유롭게<br>스터디 그룹을 만들고 운영할 수 있어요</p>
                    </div>
                  </div>
                  <!-- 필요시 아이템 추가 -->
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="main-section main-bottom-banner">
          <div class="main-bottom-banner-inner">
            <div class="banner-image-wrap">
              <img src="../assets/img/마스코트.png" alt="" />
            </div>
            <div class="banner-title-wrap">
              <h2 class="banner-title">함께하는 커뮤니티,<br />KOKKIRI</h2>
            </div>
            <div class="banner-download-wrap">
              <a class="btn appstore" href="https://www.apple.com/kr/app-store/" target="_blank">
                <img src="../assets/img/icon_appstore.svg" alt="App Store" class="appstore-logo" />
                <img src="../assets/img/logo_appstore.svg" alt="App Store Text" class="appstore-text" />
              </a>
              <a class="btn googleplay" href="https://play.google.com/store/apps?hl=ko" target="_blank">
                <img src="../assets/img/icon_playstore.svg" alt="Google Play" class="googleplay-logo" />
                <img src="../assets/img/logo_playstore.svg" alt="Google Play Text" class="googleplay-text" />
              </a>
            </div>
          </div>
        </section>
        <footer class="main-section main-footer-info">
          <div class="main-footer-info-inner">
            <div class="footer-info-left">
              <p class="address">(우) 05717 서울시 송파구 중대로 135, 서관 12층(가락동)</p>
              <p class="org-name">
                한국인공지능·소프트웨어산업협회(구.한국소프트웨어산업협회) SW기술자 경력확인 담당자 앞
              </p>
              <p class="contact">대표전화 : 02-2188-6980 FAX : 0502-777-6967</p>
            </div>
            <div class="footer-info-right">
              <span class="contact-title">대표전화</span>
              <span class="contact-num">02-2188-6980</span>
              <span class="fax-title">FAX</span>
              <span class="fax-num">0502-777-6967</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
// 회원사 리스트 불러오기
import { companyList } from '@/data/companyList'
// 소개 아이템들 리스트 불러오기
import platformFeatureList from '@/data/platformFeatureList'
// 로고 애니메이션.
import {ref, onMounted, onUnmounted, nextTick, computed} from 'vue'

const isVisible = ref(false);
const mascotRef = ref(null);

// 팝업 애니메이션을 위한 변수들
const boardWrapRef = ref(null);
const popupMainRef = ref(null);
const popupCommentRef = ref(null);
const isPopupMainVisible = ref(false);
const isPopupCommentVisible = ref(false);

// 팝업 애니메이션 설정 함수
function setupPopupAnimations() {
  // 본문 팝업 관찰자
  const popupMainObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      // 약간의 지연 효과를 주기 위해 setTimeout 사용
      setTimeout(() => {
        isPopupMainVisible.value = true;
      }, 300);
    } else {
      isPopupMainVisible.value = false;
    }
  }, { threshold: 0.3 });

  // 댓글 팝업 관찰자
  const popupCommentObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      // 두 번째 팝업은 더 늦게 나타나도록 설정
      setTimeout(() => {
        isPopupCommentVisible.value = true;
      }, 700);
    } else {
      isPopupCommentVisible.value = false;
    }
  }, { threshold: 0.3 });

  // 전체 래퍼를 관찰하여 두 팝업 모두 제어
  const wrapperObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      isPopupMainVisible.value = false;
      isPopupCommentVisible.value = false;
    }
  }, { threshold: 0.1 });

  // 관찰자들 등록 및 저장
  if (boardWrapRef.value) {
    wrapperObserver.observe(boardWrapRef.value);
    observers.value.push(wrapperObserver);
  }
  if (popupMainRef.value) {
    popupMainObserver.observe(popupMainRef.value);
    observers.value.push(popupMainObserver);
  }
  if (popupCommentRef.value) {
    popupCommentObserver.observe(popupCommentRef.value);
    observers.value.push(popupCommentObserver);
  }
}

onMounted(() => {
  const mascotObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true;
    } else {
      isVisible.value = false; // 화면에서 사라질 때 .show 제거
    }
  });
  if (mascotRef.value) {
    mascotObserver.observe(mascotRef.value);
    observers.value.push(mascotObserver); // 배열에 저장
  }
});

// 숫자 카운트 애니메이션
const displayNumbers = ref(platformFeatureList.map(() => 0))
const itemRefs = ref([])
const timers = []

// Observer들을 저장할 배열 (메모리 누수 방지)
const observers = ref([])

function setItemRefs(el, idx) {
  if (el) {
    itemRefs.value[idx] = el
  }
}

function animateNumber(idx, target) {
  let current = 0
  const step = Math.max(1, Math.floor(target / 70))
  clearInterval(timers[idx])
  timers[idx] = setInterval(() => {
    current += step
    if (current >= target) {
      displayNumbers.value[idx] = target
      clearInterval(timers[idx])
    } else {
      displayNumbers.value[idx] = current
    }
  }, 15)
}

onMounted(async () => {
  itemRefs.value = []
  await nextTick()

  itemRefs.value.forEach((el, idx) => {
    const countObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateNumber(idx, platformFeatureList[idx].value)
      } else {
        displayNumbers.value[idx] = 0
        clearInterval(timers[idx])
      }
    }, { threshold: 0.5 })
    if (el) {
      countObserver.observe(el)
      observers.value.push(countObserver) // 배열에 저장
    }
  })

  // 팝업 애니메이션 처리
  setupPopupAnimations()
})

const companySearch = ref('')

const filteredCompanyList = computed(() => {
  if (!companySearch.value.trim()) return companyList // 검색 없으면 전체
  return companyList.filter(company =>
      company.name.toLowerCase().includes(companySearch.value.toLowerCase())
  )
})

// 메모리 누수 방지: 컴포넌트 언마운트 시 모든 리소스 정리
onUnmounted(() => {
  // 모든 IntersectionObserver 정리
  observers.value.forEach(observer => {
    observer.disconnect()
  })
  observers.value = []

  // 모든 타이머 정리
  timers.forEach(timer => {
    clearInterval(timer)
  })
  timers.length = 0
})



</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ########## Front-Page ##########*/
.container.front {
  // 최상위 스타일
  .layout-wrap {
    width: 100%;
    height: 3459px;
    display: flex;
    margin: 0 auto;
    /* 사이드바 */
    .side-bar {
      position: fixed;
      display: flex;
      border-right: $cloudy-gray;
      width: 300px;
      height: 100%;
      .side-content {
        width: inherit;
        height: inherit;
        /* 로그인,회원가입 버튼*/
        .side-content-wrap {
          width: inherit;
          height: 284px;
          border-bottom: 1px solid $silver-gray;
          .side-logo {
            width: inherit;
            height: 115px;
            display: flex;               // flex
            justify-content: center;     // 가로 가운데
            align-items: center;         // 세로 가운데
            padding-top: 45px;

            img {
              width: 202px;
              height: 92px;
            }
          }

          .side-login-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding-top: 26px;
            .btn-login,
            .btn-signup {
              width: 252px;
              height: 40px;
              border-radius: 15px;
              display: flex;             // flex 레이아웃 적용
              justify-content: center;   // 가로 중앙 정렬
              align-items: center;       // 세로 중앙 정렬
              font-size: 14px;
              font-weight: bold;
              border: white;
              &:active {
                transform: translateY(2px);
              }
            }
            .btn-login {
              background: white;
              border: 1px solid $dark-gray;
            }
            .btn-signup {
              background: $main-color;
              color: $cloudy-gray;
            }
            .find-account {
              font-size: 12px;
              color: #737373;
              text-decoration: underline;
              &:hover {
                color: $main-color;
              }
              &:active {
                transform: translateY(2px);
              }
            }
          }
        }
        /* 회원사 리스트 */
        .side-member-list-box {
          .side-member-header {
            width: 300px;
            height: 112px;
            padding: 18px 0;
            display: flex;
            flex-direction: column;
            align-items: center;

            .side-member-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 12px;
              width: 100%;
              text-align: left;
              padding-left: 24px;
            }

            .side-member-search {
              width: 276px;
              height: 44px;
              background: $silver-gray;
              border-radius: 18px;
              display: flex;
              align-items: center;
              padding: 0 18px;

              input[type="text"] {
                border: none;
                background: transparent;
                outline: none;
                width: 100%;
                font-size: 14px;
                font-weight: 400;
                color: $dark-black;
                padding: 0;
                &::placeholder {
                  color: $light-black;
                  font-size: 14px;
                  font-weight: 400;
                }
                &:focus::placeholder {
                  visibility: hidden;
                }
              }

              .bi-search {
                font-size: 18px;
                color: #a6a6a6;
                cursor: pointer;
                flex-shrink: 0;
              }

              &:has(input:focus) {
                border: 2px solid $main-color;
                background: white;
                .bi-search {
                  color: $main-color;
                }
              }
            }
          }
          .side-member-list {
            display: flex;
            flex-direction: column;
            overscroll-behavior: contain;
            overscroll-behavior-x: contain;
            overscroll-behavior-y: contain;
            height: calc(100vh - 412px);
            overflow-y: auto;

            &::-webkit-scrollbar {
              display: none;
            }

            .side-member-item {
              width: 100%;
              height: 44px;
              display: flex;
              justify-content: space-between;
              padding: 24px;
              background: white;
              align-items: center;

              &:hover {
                background: $cloudy-gray;
              }

              .company-name {
                font-size: 14px;
                font-weight: 400;
                color: $silver-black;
              }
              .bi.bi-arrow-up-right-square {
                color: $silver-black;
              }
            }
          }
        }
      }
    }
    /* 메인 콘텐츠 영역 */
    .main-content {
      margin-left: 300px;
      width: calc(100% - 300px); // 전체에서 사이드바만큼 빼기
      height: 100%;
      // 모든 섹션 공통 스타일
      .main-section {
        min-width: 1200px;
        // 메인 히어로 섹션
        &.main-hero {
          background: $cloudy-gray;
          height: 716px;
          padding: 40px;
          .main-hero-inner {
            background: white;
            border-radius: 0 500px 500px 0;
            height: 100%;
            min-height: 556px;
            padding: 160px 198px;
            display: flex;
            align-items: center;
            justify-content: center;

            .main-hero-content-box {
              display: flex;
              width: 100%;
              height: 100%;
              align-items: center;
              justify-content: space-between;
            }

            .main-hero-left {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              min-width: 430px;
              .main-hero-title {
                font-size: 58px;
                font-weight: 700;
                color: #333333;
                line-height: 1.2;
                letter-spacing: 0.8px;
              }

              .main-hero-desc {
                font-size: 22px;
                font-weight: 400;
                color: #444444;
                margin-bottom: 32px;
                line-height: 1.5;
              }

              .main-hero-download {
                display: flex;
                gap: 8px;

                .btn {
                  width: 158px;
                  height: 58px;
                  background: #292929;
                  border-radius: 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                  text-decoration: none;

                  &:hover {
                    opacity: 0.8;
                  }

                  &:active {
                    transform: translateY(2px);
                  }
                }

                .appstore-logo {
                  width: 19px;
                  height: 24px;
                }

                .appstore-text {
                  width: 75px;
                  height: 20px;
                }

                .googleplay-logo {
                  width: 23px;
                  height: 26px;
                }

                .googleplay-text {
                  width: 87px;
                  height: 18px;
                }
              }
            }

            .main-hero-right {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-end;

              .main-hero-elephant {
                width: 343px;
                height: 343px;
                object-fit: contain;
                opacity: 0;
                transform: translateY(50px) scale(0.92);
                transition: opacity 2s cubic-bezier(0.19,1,0.22,1) 0.5s,
                transform 1.6s cubic-bezier(0.19,1,0.22,1) 0.5s;

                &.show {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }

                // 호버시 바운스 효과 (선택)
                &:hover {
                  animation: bounce 0.7s;
                }
              }
              @keyframes bounce {
                0%   { transform: translateY(0) scale(1); }
                20%  { transform: translateY(-16px) scale(1.05);}
                40%  { transform: translateY(0) scale(0.98);}
                60%  { transform: translateY(-10px) scale(1.03);}
                100% { transform: translateY(0) scale(1);}
              }
            }
          }
        }
        // 메인 플랫폼 섹션
        &.main-platform {
          min-height: 698px;
          padding: 120px 0;
          background: #fff; // 필요에 따라

          .main-platform-inner {
            width: 100%;
            max-width: 1440px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .platform-title-wrap {
            text-align: center;

            .platform-title {
              font-size: 48px;
              font-weight: 700;
              color: #333333;
              line-height: 1.2;
              margin-bottom: 20px;
            }
            .platform-desc {
              font-size: 22px;
              font-weight: 400;
              color: #333333;
              line-height: 1.4;
              margin-bottom: 40px; // 리스트 박스와의 간격
            }
          }

          .platform-feature-list {
            width: 1044px;
            height: 221px;
            background: #f9f9f9;
            border-radius: 200px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 48px 96px;
            margin-top: 40px;
            //box-shadow: 0 8px 24px 0 rgba(0,0,0,0.04);

            .platform-feature-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              flex: 1;
              margin-top: 30px;

              .feature-icon-wrap {
                margin-bottom: 16px;
                img {
                  width: 40px;
                  height: 40px;
                  display: block;
                }
              }

              .feature-desc-wrap {
                display: flex;
                flex-direction: column;
                align-items: center;

                .feature-title {
                  font-size: 16px;
                  font-weight: 700;
                  color: #737373;
                  margin-bottom: 8px;
                }

                .feature-count {
                  display: flex;
                  align-items: flex-end;
                  gap: 4px;

                  .number {
                    font-size: 35.33px;
                    font-weight: 700;
                    color: #333333;
                    line-height: 1;
                  }
                  .unit {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333333;
                    line-height: 1;
                  }
                }
              }
            }
            .vertical-divider {
              display: inline-block;
              transform: rotate(90deg);
              font-size: 28px;
              color: #ededed;
              margin: 0 16px;
              vertical-align: middle;
              user-select: none;
              pointer-events: none;
            }
          }
        }
        // 메인 커뮤니티 섹션
        &.main-community {
          height: 1412px;
          background: #fff;
          background: $cloudy-gray;
          .main-community-inner {
            display: flex;
            align-items: flex-start;
            padding: 120px 112px;
            height: 100%;

            .community-left {
              display: flex;
              flex-direction: column;
              gap: 60px;

              .community-info-wrap {
                width: 528px;
                height: 300px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 24px;
                .community-icon {
                  width: 80px;
                  height: 80px;
                  .bi.bi-chat-text-fill {
                    color: $main-color;
                    font-size: 80px;
                  }
                }
                .community-title-wrap {
                  color: $dark-black;
                  h2.community-title {
                    font-size: 48px;
                    font-weight: 700;
                  }
                  p.community-desc {
                    margin-top: 10px;
                    font-size: 22px;
                    font-weight: normal;
                  }
                }
              }
              .community-board-wrap {
                height: 792px;
                position: relative;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
                .board-popup {
                  width: 357px;
                  height: 259px;
                  position: absolute;
                  background: white;
                  border-radius: 30px;
                  box-shadow: 0 8px 32px rgba(50, 70, 128, 0.11);
                  padding: 24px;
                  opacity: 0;
                  transform: translateY(30px);
                  transition: opacity 0.8s cubic-bezier(0.19,1,0.22,1),
                              transform 0.8s cubic-bezier(0.19,1,0.22,1);

                  &.show {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .board-popup-main {
                  top: 130px;
                  left: 0;
                  z-index: 2;
                  transform: translateX(-30px) translateY(20px);

                  &.show {
                    transform: translateX(0) translateY(0);
                  }
                }

                .board-popup-comment {
                  bottom: 80px;
                  right: 0;
                  z-index: 3;
                  transform: translateX(30px) translateY(20px);

                  &.show {
                    transform: translateX(0) translateY(0);
                  }
                }
              }
            }

            .community-right {
              margin: auto;
              width: 380px;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 24px;
              .community-type-box {

                .community-type-info-wrap {
                  color: $dark-black;
                  h3.community-type-title {
                    font-size: 36px;
                    font-weight: 700;
                    margin-bottom: 16px;
                  }
                  p.community-type-desc {
                    font-size: 18px;
                    margin-bottom: 28px;
                    font-weight: normal;
                  }
                }
                .community-type-list {
                  .community-type-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 28px;
                    .type-icon {
                      width: 80px;
                      height: 80px;
                      margin-right: 16px;
                      background: #f2f2f2;
                      border-radius: 50px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      .bi {
                        color: $main-color;
                        font-size: 34px;
                      }
                    }
                    .type-info-wrap {
                      h4.type-title {
                        font-size: 22px;
                        font-weight: 700;
                        margin-bottom: 6px;
                        color: $dark-black;
                      }
                      p.type-desc {
                        font-size: 16px;
                        font-weight: 400;
                        color: $dark-black;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // 메인 하단 섹션
        &.main-bottom-banner {
          height: 537px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;

          .main-bottom-banner-inner {
            width: 100%;
            padding: 125px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .banner-image-wrap {
            margin-bottom: 28px;
            width: 103px;
            height: 103px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 30px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08),
            -8px -8px 24px rgba(0, 0, 0, 0.08);

            img {
              width: 80px;
              height: 80px;
              object-fit: contain;
            }
          }

          .banner-title-wrap {
            margin-bottom: 32px;
            .banner-title {
              font-size: 32px;
              font-weight: 700;
              text-align: center;
              line-height: 1.2;
            }
          }

          .banner-download-wrap {
            display: flex;
            gap: 8px;
            .btn {
              width: 158px;
              height: 58px;
              background: #292929;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              text-decoration: none;

              &:hover {
                opacity: 0.8;
              }

              &:active {
                transform: translateY(2px);
              }
            }

            .appstore-logo {
              width: 19px;
              height: 24px;
            }

            .appstore-text {
              width: 75px;
              height: 20px;
            }

            .googleplay-logo {
              width: 23px;
              height: 26px;
            }

            .googleplay-text {
              width: 87px;
              height: 18px;
            }
          }
        }
        // 푸터 섹션
        &.main-footer-info {
          height: 176px;
          background: $cloudy-gray;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 35px 35px;
          color: #777777;
          .main-footer-info-inner {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .footer-info-left {
            display: flex;
            flex-direction: column;
            gap: 6px;
            font-size: 15px;
          }

          .footer-info-right {
            display: flex;
            align-items: center;
            gap: 10px;

            .contact-title,
            .fax-title {
              font-weight: 700;
              color: #222;
              font-size: 15px;
              margin-right: 2px;
            }
            .contact-num,
            .fax-num {
              color: #888;
              font-size: 15px;
              margin-right: 12px;
            }
          }
        }
      }
    }
  }
}
</style>