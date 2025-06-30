<template>

  <aside class="mainbody-right">
    <div class="mainbody-right-inner">
      <!-- 검색 박스 (메인페이지 루트에서만 보임) -->
      <form
          class="board-search-box"
          v-if="$route.path === '/main-page' || $route.path === '/main-page/search'"
          @submit.prevent="onSearch"
      >
        <input
            type="text"
            class="search-input"
            placeholder="전체 게시판의 글을 검색하세요!"
            v-model="searchText"
        />
        <button type="submit" class="search-btn">
          <i class="bi bi-search"></i>
        </button>
      </form>
      <!-- 게시판 리스트 섹션 -->
      <div class="right-board-section">
        <!-- 공지사항 -->
        <ul class="right-board-list">
          <li class="right-board-title-row">
            <router-link class="right-board-title notice" to="/main-page/notice">공지사항</router-link>
            <router-link class="right-board-more" to="/main-page/notice">더 보기</router-link>
          </li>
          <li
            v-for="notice in noticeList.slice(0, 3)"
            :key="notice.id"
            @click="goNoticeDetail(notice.id)"
            class="right-board-item"
            style="cursor:pointer"
          >
            <span class="right-board-text">{{ notice.title }}</span>
            <span class="right-board-meta">{{ notice.date }}</span>
          </li>
          <li v-if="noticeList.length === 0" class="right-board-item empty">
            <span class="right-board-text">게시글이 없습니다</span>
          </li>
        </ul>
        <!-- HOT 게시판 -->
        <ul class="right-board-list">
          <li class="right-board-title-row">
            <router-link class="right-board-title best" to="/main-page/hot-board">HOT 게시판</router-link>
            <router-link class="right-board-more" to="/main-page/hot-board">더 보기</router-link>
          </li>
          <li
            v-for="hot in hotList.slice(0, 3)"
            :key="hot.id"
            @click="goHotDetail(hot.id)"
            class="right-board-item"
            style="cursor:pointer"
          >
            <span class="right-board-text">{{ hot.title }}</span>
            <span class="right-board-meta">{{ hot.date }}</span>
          </li>
          <li v-if="hotList.length === 0" class="right-board-item empty">
            <span class="right-board-text">게시글이 없습니다</span>
          </li>
        </ul>
      </div>
    </div>
  </aside>

</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const searchText = ref('')
  const noticeList = ref([])
  const hotList = ref([])
  const token = localStorage.getItem('accessToken');
  const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

onMounted(fetchBoardPreviews)

watch(
  () => route.fullPath,
  async (newPath) => {
    await fetchBoardPreviews()
    if (newPath !== '/main-page') {
      searchText.value = ''
    }
  }
)

async function fetchBoardPreviews() {
  try {
    // 공지사항
    const res = await axios.get(`${API_BASE_URL}/api/boards/preview/4`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    noticeList.value = res.data.map(item => ({
      id: item.id,
      title: item.boardTitle,
      date: item.createdAt?.slice(0, 10) || ''
    }))

    // HOT 게시판
    const hotRes = await axios.get(`${API_BASE_URL}/api/boards/preview/3`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    hotList.value = hotRes.data.map(item => ({
      id: item.id,
      title: item.boardTitle,
      date: item.createdAt?.slice(0, 10) || ''
    }))
  } catch (err) {
    console.error('메인 게시판 데이터 불러오기 실패:', err)
  }
}

  // 전체 검색
  function onSearch() {
    if (searchText.value.trim() !== '') {
      router.push({ 
        path: '/main-page/search',
        query: { keyword: searchText.value }
      });
    }
  }

  //밑에는 클릭 시 이동 관련.
  function goNoticeDetail(id) {
    router.push({ path: `/main-page/notice/${id}` })
  }
  function goHotDetail(id) {
    router.push({ path: `/main-page/free-board/${id}` })
  }
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

/* ###### Component-Right #######*/
.mainbody-right {
  width: 323px;
  background: none;
  margin-top: 0;

  .mainbody-right-inner {
    width: 100%;
    height: auto;
    background: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .board-search-box {
    width: 323px;
    height: 40px;
    border: 2px solid #dddddd;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 6px;
    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 14px;
      color: #777777;
      outline: none;

      &::placeholder {
        color: #777777;
        font-size: 14px;
        font-family: 'Noto Sans KR', sans-serif;
      }
    }

    i {
      font-size: 16px;
      color: #777777;
      margin-left: 6px;
    }
    .search-btn {
      border: none;
      background: none;
    }
  }

  .right-board-section {
    width: 100%;
    background: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 6px;

    .right-board-list {
      margin-top: 0;
      width: 323px;
      background: #f5f5f5;
      border: 1px solid #dddddd;
      border-radius: 0;
      padding: 0;

      .right-board-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 16px;
        border-bottom: 1px solid #dddddd;

        .right-board-title {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 14px;
          font-weight: bold;
          color: #fd5631;

          &.notice {
            color: #fd5631;
          }
          &.best {
            color: #fd5631;
          }
        }

        .right-board-more {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: #999999;
          text-decoration: none;
        }
      }

      .right-board-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 38px;
        padding: 0 16px;
        background: #f5f5f5;
        border-bottom: 1px solid #dddddd;
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        transition: background 0.12s;
        margin: 0;
        &:hover {
          background: #dddddd;
        }

        &:last-child {
          border-bottom: none;
        }

        &.empty {
          cursor: default;
          background: #f5f5f5;
        }

        .right-board-text {
          font-size: 12px;
          color: #333333;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60%;
        }

        .right-board-meta {
          font-size: 11px;
          color: #999999;
          min-width: 62px;
          text-align: right;
        }
      }
    }
  }
}
</style>