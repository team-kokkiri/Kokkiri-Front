<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore()
    
    onMounted(async () => {
      // 앱 시작 시 사용자 정보 복원
      await userStore.restoreUser()
    })
    
    return {}
  }
}
</script>

<style>

</style>