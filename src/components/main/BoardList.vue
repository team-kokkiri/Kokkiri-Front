<template>
  <div class="board-list">
    <div class="board-title-row">
      <h2 class="board-title">{{ boardTitle }}</h2>
      <span class="board-more" @click="goToBoardPage">더 보기</span>
    </div>

    <ul class="board-items">
      <li v-if="boardItems.length === 0" class="board-item empty">
        <span class="board-text">게시글이 없습니다.</span>
      </li>
      <li
          v-for="item in boardItems"
          :key="item.id"
          class="board-item"
          @click="$emit('board-item-click', item.id)"
      >
        <span class="board-text">{{ item.text }}</span>
        <span class="board-meta">{{ item.meta }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  boardTitle: {
    type: String,
    required: true
  },
  boardTypeId: {
    type: Number,
    required: true
  },
  boardItems: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['board-item-click'])

function goToBoardPage() {
  if (props.boardTypeId === 1) {
    router.push('/main-page/notice')
  } else if (props.boardTypeId === 2) {
    router.push('/main-page/free-board')
  } else if (props.boardTypeId === 3) {
    router.push('/main-page/hot-board')
  } else {
    console.warn('알 수 없는 게시판 타입:', props.boardTypeId)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.board-list {
  background: white;
  border: 1px solid #DDDDDD;

  .board-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: #F5F5F5;
    border-bottom: 1px solid #DDDDDD;

    .board-title {
      font-family: $primary-kr;
      font-weight: 700;
      font-size: 14px;
      color: $royalblue;
      margin: 0;
    }

    .board-more {
      font-family: $primary-kr;
      font-weight: 400;
      font-size: 11px;
      color: $light-black;
      cursor: pointer;

      &:hover {
        color: $silver-black;
      }
    }
  }

  .board-items {
    margin: 0;
    padding: 0;
    list-style: none;

    .board-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid #DDDDDD;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #FAFAFA;
      }

      &.empty {
        justify-content: center;
        color: $light-black;
        cursor: default;
      }

      .board-text {
        font-family: $primary-kr;
        font-weight: 400;
        font-size: 12px;
        color: $dark-black;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 20px;
      }

      .board-meta {
        font-family: $primary-kr;
        font-weight: 400;
        font-size: 11px;
        color: $light-black;
        white-space: nowrap;
      }
    }
  }
}
</style>