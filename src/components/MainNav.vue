<template>
  <nav class="mainpage-nav">
    <div class="mainnav-inner">
      <div class="nav-menu-list">
        <button
            v-for="menu in menuList"
            :key="menu.name"
            type="button"
            class="nav-menu-item icon-btn"
            :class="{ active: activeMenu === menu.name }"
            @click="handleMenuClick(menu)"
        >
          <span class="menu-text">{{ menu.name }}</span>
          <span class="menu-dot"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  const menuList = [
    { name: '자유게시판', path: '' },
    { name: '자료공유 게시판', path: '/calendar' },
    { name: 'HOT 게시물', path: '/party' },
  ]

  const activeMenu = ref('자유게시판')

  watch(
      () => route.path,
      (newPath) => {
        const found = menuList.find(menu => `/main-page${menu.path}` === newPath)
        if (found) activeMenu.value = found.name
      },
      { immediate: true }
  )

  function handleMenuClick(menu) {
    activeMenu.value = menu.name
    router.push(`/main-page${menu.path}`)
  }
</script>

<style scoped>

</style>