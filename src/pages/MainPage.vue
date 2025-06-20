<template>
  <div class="container mainpage">
    <MainHeader />
    <MainNav v-if="route.meta.showNav" />
    <div class="mainpage-body">
      <div class="mainbody-inner">
        <div class="mainbody-left"></div>
        <div class="mainbody-center">
          <router-view />
        </div>
        <div class="mainbody-right"></div>
      </div>
    </div>
    <div class="mainpage-footer">
      <div class="footer-inner"></div>
    </div>
  </div>

</template>

<script setup>
import MainHeader from '@/components/MainHeader.vue'
import MainNav from "@/components/MainNav.vue";
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>

</style>