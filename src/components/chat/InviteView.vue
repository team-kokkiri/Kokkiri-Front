<template>
  <div class="invite-view">
    <!-- 헤더 -->
    <div class="invite-header">
      <div class="header-left">
        <span class="invite-title">초대하기</span>
      </div>
      <button class="btn-back" @click="goBack">
        <i class="bi bi-arrow-left"></i>
      </button>
    </div>

    <!-- 채팅창 영역 (빈 공간) -->
    <div class="invite-content-area">
      <!-- 초대 리스트 -->
      <div class="invite-list">
        <div
            class="invite-user-item"
            v-for="user in filteredUsers"
            :key="user.id"
        >
          <img class="avatar" :src="user.avatar" :alt="user.nickname" />
          <div class="user-info">
            <span class="nickname">{{ user.nickname }}</span>
            <span class="email">{{ user.email }}</span>
          </div>
          <button
              class="btn-invite"
              @click="handleInvite(user)"
              :disabled="isUserInvited(user.id)"
          >
            {{ isUserInvited(user.id) ? '초대됨' : '초대' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 검색창 -->
    <div class="invite-search">
      <input
          type="text"
          class="invite-input"
          placeholder="초대할 사람을 검색하세요"
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
  // 사용자 목록 (상위 컴포넌트에서 관리)
  users: {
    type: Array,
    required: true,
    default: () => []
  },
  // 이미 초대된 사용자 ID 목록
  invitedUserIds: {
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

// Emits (단방향 데이터 플로우 유지)
const emit = defineEmits([
  'back',           // 뒤로가기
  'invite',         // 사용자 초대
  'search'          // 검색어 변경
])

// 검색 필터링된 사용자 목록 (순수 계산)
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

// 사용자 초대 상태 확인
function isUserInvited(userId) {
  return props.invitedUserIds.includes(userId)
}

// 뒤로가기 버튼 클릭
function goBack() {
  emit('back')
}

// 검색창 입력 처리
function handleSearchInput(event) {
  emit('search', event.target.value)
}

// 초대 버튼 클릭
function handleInvite(user) {
  if (isUserInvited(user.id)) return
  emit('invite', user)
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.invite-view {
  width: 794px;
  height: 778px;
  border: 1px solid $dim-gray;
  border-radius: 15px 15px 0px 0px;
  background: $white;
  display: flex;
  flex-direction: column;
  position: relative;

  // 헤더
  .invite-header {
    height: 72px;
    padding: 16px;
    border-bottom: 1px solid $dim-gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .header-left {
      .invite-title {
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
  .invite-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    // 초대 리스트
    .invite-list {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 15px;

      .invite-user-item {
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

        .btn-invite {
          width: 65px;
          height: 36px;
          background-color: $main-color;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          font-family: $primary-kr;
          font-weight: 700;
          font-size: 16px;
          line-height: 1.45;
          color: $white;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover:not(:disabled) {
            background-color: darken($main-color, 10%);
          }

          &:disabled {
            background-color: $silver-black;
            cursor: not-allowed;
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
  .invite-search {
    height: 60px;
    border-top: 1px solid $dim-gray;
    background-color: $light-gray;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 20px;

    .invite-input {
      flex: 1;
      height: 100%;
      border: none;
      background: transparent;
      font-family: $primary-kr;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.2;
      color: $dark-black;
      outline: none;

      &::placeholder {
        color: $silver-black;
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