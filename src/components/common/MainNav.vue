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
            :data-hot="menu.name === 'HOT 게시물' ? 'true' : null"
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
    { name: '자유게시판', path: '/free-board' },
    { name: '자료공유 게시판', path: '/share-board' },
    { name: 'HOT 게시물', path: '/hot-board' },
  ]

  const activeMenu = ref('')

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

<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ###### Component-Nav #######*/
.mainpage-nav {
  display: flex;
  height: 55px;
  background: $silver-gray;
  border-bottom: 1px solid $dark-gray;
  align-items: center;
  justify-content: center;
  .mainnav-inner {
    width: 1180px;
    min-width: 1180px;
    height: 73px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .nav-menu-list {
      display: flex;
      gap: 1px; // 메뉴 사이 여백은 상황에 맞게 조정
      margin-left: 280px;

      .nav-menu-item {
        height: 73px;
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 16px;
        font-size: 14px;
        color: $dark-black;
        position: relative;

        .menu-text {
          font-size: 14px;
          font-weight: 400;
          color: $dark-black;
          letter-spacing: 1px;
          font-family: $secondary-kr;
        }

        .menu-dot {
          color: $silver-gray;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          margin-left: 8px;
        }
        &.active .menu-text {
          color: $main-color;
          font-weight: bold;
        }
        &.active[data-hot="true"] .menu-text {
          color: $crimson;
          font-weight: bold;
        }

        &.active .menu-dot {
          display: inline-block;
          // 도트 색상 분기 (vue에서 처리)
          background: $main-color; // 기본 파랑
        }

        // HOT 게시물 도트 색 변경 (vue에서 active + name으로 구분)
        &.active[data-hot="true"] .menu-dot {
          background: #ed2040; // 빨강
        }
      }
    }
  }
}
</style>