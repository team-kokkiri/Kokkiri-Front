<template>
  <div class="user-list-view">
    <!-- 헤더 -->
    <div class="user-list-header">
      <div class="header-left">
        <span class="user-list-title">유저목록</span>
      </div>
      <button class="btn-back" @click="goBack">
        <i class="bi bi-arrow-left"></i>
      </button>
    </div>

    <!-- 유저 목록 영역 -->
    <div class="user-list-content-area">
      <div class="user-list">
        <div
            class="user-item"
            v-for="user in filteredUsers"
            :key="user.id"
        >
          <img class="avatar" :src="user.avatar" :alt="user.nickname" />
          <div class="user-info">
            <span class="nickname">{{ user.nickname }}</span>
            <span class="email">{{ user.email }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 검색창 -->
    <div class="user-list-search">
      <input
          type="text"
          class="search-input"
          placeholder="찾을 사람을 검색하세요"
          :value="searchQuery"
          @input="handleSearchInput"
      />
      <i class="bi bi-search search-icon"></i>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  // 채팅방에 참여중인 사용자 목록
  users: {
    type: Array,
    required: true,
    default: () => []
  },
  // 검색어 (상위 컴포넌트에서 관리)
  searchQuery: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits([
  'back',           // 뒤로가기
  'search'          // 검색어 변경
])

// 검색 필터링된 사용자 목록
const filteredUsers = computed(() => {
  if (!props.searchQuery) {
    return props.users
  }

  const query = props.searchQuery.toLowerCase()
  return props.users.filter(user =>
      user.nickname.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  )
})

// 뒤로가기 버튼 클릭
function goBack() {
  emit('back')
}

// 검색창 입력 처리
function handleSearchInput(event) {
  emit('search', event.target.value)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.user-list-view {
  width: 794px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0px 0px;
  background: $white;
  display: flex;
  flex-direction: column;
  position: relative;

  // 헤더
  .user-list-header {
    height: 72px;
    padding: 16px;
    border-bottom: 1px solid $dim-gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .header-left {
      .user-list-title {
        font-family: $secondary-kr;
        font-weight: 500;
        font-size: 18px;
        line-height: 1.25;
        color: $dark-black;
      }
    }

    .btn-back {
      width: 26px;
      height: 26px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      .bi {
        font-size: 18px;
        color: $black;
      }

      &:hover {
        background-color: rgba($black, 0.05);
        border-radius: 4px;
      }
    }
  }

  // 메인 컨텐츠 영역
  .user-list-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    // 유저 리스트
    .user-list {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 15px;

      .user-item {
        display: flex;
        align-items: center;
        gap: 30px;
        padding: 0;
        width: 754px;
        height: 50px;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;

          .nickname {
            font-family: $secondary-kr;
            font-weight: 500;
            font-size: 18px;
            line-height: 1.25;
            color: $dark-black;
          }

          .email {
            font-family: $primary-kr;
            font-weight: 400;
            font-size: 14px;
            line-height: 1.2;
            color: $dark-black;
          }
        }
      }

      // 스크롤바 스타일링
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: $light-gray;
      }

      &::-webkit-scrollbar-thumb {
        background: $silver-black;
        border-radius: 3px;

        &:hover {
          background: darken($silver-black, 20%);
        }
      }
    }
  }

  // 검색창 (하단 고정)
  .user-list-search {
    height: 60px;
    border-top: 1px solid $dim-gray;
    background-color: $light-gray;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 20px;

    .search-input {
      flex: 1;
      height: 100%;
      border: none;
      background: transparent;
      font-family: $primary-kr;
      font-weight: 350;
      font-size: 14px;
      line-height: 1.2;
      color: $dark-black;
      outline: none;

      &::placeholder {
        color: #686868;
      }
    }

    .search-icon {
      width: 24px;
      height: 24px;
      color: $silver-black;
      font-size: 16px;
      flex-shrink: 0;
    }
  }
}
</style>