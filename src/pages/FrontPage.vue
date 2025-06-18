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
              <a class="btn-login" href="/login">로그인</a>
              <a class="btn-signup" href="/signup">KOSA 회원가입</a>
              <a class="find-account" href="#">아이디/비밀번호 찾기</a>
              <hr />
            </div>
          </div>
          <div class="side-member-list-box">
            <div class="side-member-header">
              <span class="side-member-title">KOSA 소속 회원사</span>
              <div class="side-member-search">
                <input type="text" placeholder="회원사 검색" />
                <i class="bi bi-search"></i>
              </div>
            </div>
            <div class="side-member-list">
              <a
                  class="side-member-item"
                  v-for="(company, idx) in companyList"
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
import {ref, onMounted, nextTick} from 'vue';

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

  if (boardWrapRef.value) wrapperObserver.observe(boardWrapRef.value);
  if (popupMainRef.value) popupMainObserver.observe(popupMainRef.value);
  if (popupCommentRef.value) popupCommentObserver.observe(popupCommentRef.value);
}

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true;
    } else {
      isVisible.value = false; // 화면에서 사라질 때 .show 제거
    }
  });
  if (mascotRef.value) observer.observe(mascotRef.value);
});

// 숫자 카운트 애니메이션
const displayNumbers = ref(platformFeatureList.map(() => 0))
const itemRefs = ref([])
const timers = []

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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateNumber(idx, platformFeatureList[idx].value)
      } else {
        displayNumbers.value[idx] = 0
        clearInterval(timers[idx])
      }
    }, { threshold: 0.5 })
    if (el) observer.observe(el)
  })

  // 팝업 애니메이션 처리
  setupPopupAnimations()
})

</script>

<style scoped>

</style>