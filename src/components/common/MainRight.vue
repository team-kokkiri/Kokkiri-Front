<template>

  <aside class="mainbody-right">
    <div class="mainbody-right-inner">
      <!-- 검색 박스 (메인페이지 루트에서만 보임) -->
      <form
          class="board-search-box"
          v-if="$route.path === '/main-page'"
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
              v-for="(notice, i) in [...noticeList.slice(0, 3), ...Array(3 - noticeList.length).fill({ empty: true })]"
              :key="notice.id || 'empty-' + i"
              @click="!notice.empty && goNoticeDetail(notice.id)"
              class="right-board-item"
              :class="{ empty: notice.empty }"
              style="cursor:pointer"
          >
            <span class="right-board-text">
              {{ notice.empty ? "" : notice.title }}
            </span>
                    <span class="right-board-meta">
              {{ notice.empty ? "" : notice.date }}
            </span>
          </li>
        </ul>
        <!-- HOT 게시판 -->
        <ul class="right-board-list">
          <li class="right-board-title-row">
            <router-link class="right-board-title best" to="/main-page/hot-board">HOT 게시판</router-link>
            <router-link class="right-board-more" to="/main-page/hot-board">더 보기</router-link>
          </li>
          <li
              v-for="(hot, i) in [...hotList.slice(0, 3), ...Array(3 - hotList.length).fill({ empty: true })]"
              :key="hot.id || 'empty-' + i"
              @click="!hot.empty && goHotDetail(hot.id)"
              class="right-board-item"
              :class="{ empty: hot.empty }"
              style="cursor:pointer"
          >
            <span class="right-board-text">
              {{ hot.empty ? "" : hot.title }}
            </span>
                    <span class="right-board-meta">
              {{ hot.empty ? "" : hot.date }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </aside>

</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'

  const router = useRouter()
  const searchText = ref('')
  const noticeList = [
    { id: 1, title: "안녕하세요 한국SW산업협회입니다.", date: "06/04 21:09" },
    { id: 2, title: "안녕하세요 한국SW산업협회입니다.", date: "06/04 21:09" },
    { id: 3, title: "안녕하세요 한국SW산업협회입니다.", date: "06/04 21:09" },
  ]
  const hotList = [
    { id: 1, title: "HOT 게시글 예시입니다.", date: "06/04 21:09" },
    { id: 2, title: "HOT 게시글 예시입니다.", date: "06/04 21:09" },
    { id: 3, title: "HOT 게시글 예시입니다.", date: "06/04 21:09" },
  ]

  function onSearch() {
    //여기다가 검색 관련 내용 넣으면댐
  }

  //밑에는 클릭 시 이동 관련.
  function goNoticeDetail(id) {
    router.push({ path: `/main-page/notice/${id}` })
  }
  function goHotDetail(id) {
    router.push({ path: `/main-page/hot-board/${id}` })
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