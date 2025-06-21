<template>
  <div class="container mainpage">
    <MainHeader />
    <MainNav v-if="route.meta.showNav" />
    <div class="mainpage-body">
      <div class="mainbody-inner">
          <router-view />
          <MainRight v-if="route.meta.showRight"/>
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<script setup>
import MainHeader from '@/components/MainHeader.vue'
import MainNav from "@/components/MainNav.vue";
import { useRoute } from 'vue-router'
import MainFooter from "@/components/MainFooter.vue";
import MainRight from "@/components/MainRight.vue";
const route = useRoute()
</script>

<style scoped>

</style>