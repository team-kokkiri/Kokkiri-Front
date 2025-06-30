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
    <div class="user-list-content-area" ref="scrollContainerRef">
      <div class="user-list">
        <div
            class="user-item"
            v-for="user in filteredUsers"
            :key="user.memberId" >
          <img class="avatar" :src="user.avatarUrl || defaultAvatar" :alt="user.nickname" />
          <div class="user-info">
            <span class="nickname">{{ user.nickname }}</span>
            <span class="email">{{ user.email }}</span>
          </div>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <span>멤버를 불러오는 중...</span>
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
import { computed, defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
import defaultAvatar from '@/assets/img/0.png'; // 기본 아바타 이미지

// Props
const props = defineProps({
  users: { type: Array, required: true },
  searchQuery: { type: String, default: '' },
  isLoading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: true }
})

// Emits
const emit = defineEmits([
  'back',
  'search',
  'load-more'
]);

const scrollContainerRef = ref(null); // 스크롤 컨테이너의 ref

// 검색 필터링된 사용자 목록
const filteredUsers = computed(() => {
  if (!props.searchQuery) return props.users;
  const query = props.searchQuery.toLowerCase();
  return props.users.filter(user =>
      user.nickname.toLowerCase().includes(query)
      // email 검색이 필요하면 추가: || user.email.toLowerCase().includes(query)
  );
});

function goBack() { emit('back') }
function handleSearchInput(event) { emit('search', event.target.value) }

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  const container = scrollContainerRef.value;
  if (container) {
    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    // 로딩 중이 아니고, 더 불러올 데이터가 있을 때만 이벤트를 발생시킵니다.
    if (isNearBottom && !props.isLoading && props.hasMore) {
      emit('load-more');
    }
  }
};

// 컴포넌트가 마운트될 때 스크롤 이벤트 리스너를 추가
onMounted(() => {
  scrollContainerRef.value?.addEventListener('scroll', handleScroll);
});

// 컴포넌트가 언마운트될 때 리스너를 제거하여 메모리 누수를 방지
onUnmounted(() => {
  scrollContainerRef.value?.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.user-list-view {
  width: 794px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0 0;
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
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 14px;
  color: #888;
}
</style>