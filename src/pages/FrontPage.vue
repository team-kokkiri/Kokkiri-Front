<script setup>
const companyList = [
  '주식회사 시프트 바이오',
  'KOSA IT',
  '테크스타트',
  '이노솔루션',
  '에이아이랩',
  '유니코드',
  '블루버드',
  '스마트시티',
  '엔터프라이즈코리아',
  '피지엠소프트',
  '코드메이트',
  '오토테크',
  '에버플로우',
  '그린에너지',
  '블록체인센터',
  '디지털에이전시',
  '다이내믹랩스',
  '이엑스컴퍼니',
  '퓨처링크',
  '브레인파워'
];
</script>

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
                  href="#"
              >
                <span class="company-name">{{ company }}</span>
                <i class="bi bi-arrow-up-right-square"></i>
              </a>
            </div>
          </div>
        </div>
      </aside>
      <main class="main-content">
        <section class="main-section main-hero"></section>
        <section class="main-section main-platform"></section>
        <section class="main-section main-community"></section>
        <section class="main-section main-bottom-banner"></section>
        <footer class="main-section main-footer-info"></footer>
      </main>
    </div>
  </div>
</template>

<style scoped>

</style>