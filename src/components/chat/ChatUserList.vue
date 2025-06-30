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
          <!-- 본인 여부에 따라 분기 처리 -->
          <div class="user-action">
            <span v-if="user.email === userStore.email" class="me-badge">나</span>
            <button v-else class="btn-chat" @click="startChat(user)">채팅하기</button>
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
import defaultAvatar from '@/assets/img/0.png';
// 1. Pinia 스토어를 가져옵니다.
import { useUserStore } from '@/stores/user'

// 2. 스토어 인스턴스를 생성합니다.
const userStore = useUserStore()

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
  'load-more',
  'start-private-chat' // 3. 새 이벤트를 정의합니다.
]);

const scrollContainerRef = ref(null);

const filteredUsers = computed(() => {
  if (!props.searchQuery) return props.users;
  const query = props.searchQuery.toLowerCase();
  return props.users.filter(user =>
      user.nickname.toLowerCase().includes(query)
  );
});

function goBack() { emit('back') }
function handleSearchInput(event) { emit('search', event.target.value) }

// 4. 채팅 시작 이벤트를 발생시키는 함수를 추가합니다.
function startChat(user) {
  emit('start-private-chat', user);
}

const handleScroll = () => {
  const container = scrollContainerRef.value;
  if (container) {
    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    if (isNearBottom && !props.isLoading && props.hasMore) {
      emit('load-more');
    }
  }
};

onMounted(() => {
  scrollContainerRef.value?.addEventListener('scroll', handleScroll);
});

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

  .user-list-header {
    height: 72px;
    padding: 16px;
    border-bottom: 1px solid $dim-gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .header-left .user-list-title {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.25;
      color: $dark-black;
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

  .user-list-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

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
        gap: 15px; // 간격 조정
        padding: 0;
        width: 100%;
        height: 50px;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .user-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;

          .nickname {
            font-family: $secondary-kr;
            font-weight: 500;
            font-size: 18px;
            color: $dark-black;
          }

          .email {
            font-family: $primary-kr;
            font-weight: 400;
            font-size: 14px;
            color: $dark-black;
          }
        }
        
        // --- 스타일 추가 ---
        .user-action {
          flex-shrink: 0;
          margin-left: auto; // 오른쪽으로 밀어내기
          padding-right: 10px;

          .me-badge {
            font-family: $primary-kr;
            font-size: 14px;
            color: $main-color;
            font-weight: 700;
            padding: 6px 12px;
            border-radius: 6px;
            background-color: rgba($main-color, 0.1);
          }

          .btn-chat {
            padding: 6px 12px;
            background-color: $main-color;
            color: $white;
            border: none;
            border-radius: 6px;
            font-family: $secondary-kr;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover {
              background-color: darken($main-color, 10%);
            }
          }
        }
        // ------------------
      }

      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: $light-gray; }
      &::-webkit-scrollbar-thumb {
        background: $silver-black;
        border-radius: 3px;
        &:hover { background: darken($silver-black, 20%); }
      }
    }
  }

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

      &::placeholder { color: #686868; }
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
