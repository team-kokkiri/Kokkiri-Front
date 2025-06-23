<template>
  <footer class="footer-inner">
    <div class="footer-info-wrap">
      <!-- 왼쪽: 로고 + 정보 -->
      <div class="footer-info-left">
        <div class="footer-logo">
          <img src="../../assets/img/footer_logo.png" alt="KOSA 로고" />
        </div>
        <div class="footer-info-text">
          <p class="address">(우) 05717 서울시 송파구 중대로 135, 서관 12층(가락동)</p>
          <p class="org-name">한국인공지능·소프트웨어산업협회(구.한국소프트웨어산업협회) SW기술자 경력확인 담당자 앞</p>
          <p class="contact">대표전화 : 02-2188-6980  FAX : 0502-777-6967</p>
          <p class="copyright">© 2015 한국인공지능·소프트웨어산업협회(구.한국소프트웨어산업협회). ALL RIGHTS RESERVED.</p>
        </div>
      </div>

      <!-- 오른쪽: 대표전화/팩스 강조 -->
      <div class="footer-info-right">
        <span class="contact-title">대표전화</span>
        <span class="contact-num">02-2188-6980</span>
        <span class="fax-title">FAX</span>
        <span class="fax-num">0502-777-6967</span>
      </div>
    </div>
  </footer>
</template>


<script setup>

</script>


<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ###### Component-Footer #######*/
.footer-inner {
  width: 100%;
  height: 176px;
  background: $cloudy-gray;
  margin-top: 50px;
  //padding: 38px 0 0 0;

  .footer-info-wrap {
    width: 1180px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    min-height: 110px;  // 로고 세로 정렬 여유
    padding-top: 26px;
  }

  .footer-info-left {
    display: flex;
    align-items: flex-start;
    gap: 36px;

    .footer-logo {
      flex-shrink: 0;
      img {
        height: 66px;
        width: 123px;
        display: block;
      }
    }

    .footer-info-text {
      p {
        font-size: 15px;
        color: #777777;
        line-height: 1.9;
        margin: 0 0 2px 0;

        &.contact {
          margin-bottom: 0;
        }
      }
    }
  }

  .footer-info-right {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 15px;

    .contact-title,
    .fax-title {
      font-weight: 700;
      color: #333333;
      margin-right: 3px;
    }
    .contact-num,
    .fax-num {
      color: #777777;
      margin-right: 18px;
      font-weight: 400;
    }
    .fax-title,
    .fax-num {
      margin-right: 0;
    }
  }

  .footer-copyright {
    width: 100%;
    //padding: 25px 0 28px 0;
    text-align: center;
    font-size: 15px;
    color: #DDDDDD;
    font-weight: 400;
    letter-spacing: 0.01em;
  }
}
</style>