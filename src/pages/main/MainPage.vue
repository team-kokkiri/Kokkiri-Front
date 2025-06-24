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
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import MainHeader from '@/components/common/MainHeader.vue'
import MainNav from "@/components/common/MainNav.vue"
import MainFooter from "@/components/common/MainFooter.vue"
import MainRight from "@/components/common/MainRight.vue"
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()

const { initializeNotifications, cleanup } = useNotifications()

onMounted(() => {
  initializeNotifications()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>