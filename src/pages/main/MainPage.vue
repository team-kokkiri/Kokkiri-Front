<template>
  <div class="container mainpage">
    <MainHeader />
    <MainNav v-if="route.meta.showNav" />
    <div class="mainpage-body">
      <div class="mainbody-inner">
        <router-view />
        <MainRight v-if="route.meta.showRight" />
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<script setup>
import MainHeader from '@/components/common/MainHeader.vue';
import MainNav from "@/components/common/MainNav.vue";
import MainFooter from "@/components/common/MainFooter.vue";
import MainRight from "@/components/common/MainRight.vue";
import { useRoute } from 'vue-router';
import axios from '@/utils/axios';

const route = useRoute();

// 사용자 정보 조회 (로그인 상태 확인용)
async function fetchUserInfo() {
  try {
    await axios.get('/api/members/me');
  } catch (err) {
     console.warn('유저 정보 요청 실패 (무시 가능):', err);
    }
}

fetchUserInfo(); // 최초 1회 호출
</script>

<style scoped>
/* 필요 시 스타일 작성 */
</style>