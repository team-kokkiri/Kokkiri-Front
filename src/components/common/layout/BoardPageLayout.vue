<template>
  <div class="board-content">
    <div class="board-inner">
      <!-- 헤더 -->
      <div class="board-header">
        <div class="header-title">
          <h1>{{ title }}</h1>
          <p class="description">{{ description }}</p>
        </div>
      </div>

      <!-- 게시판 리스트 슬롯 -->
      <slot name="board-list" :items="items" />

      <!-- 하단 페이지네이션 -->
      <div class="board-footer" v-if="showPagination && items.length > 0">
        <ListPagination
            :currentPage="currentPage"
            :hasNext="hasNext"
            @first="$emit('first')"
            @prev="$emit('prev')"
            @next="$emit('next')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ListPagination from '@/components/board/list/ListPagination.vue'

// Props
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  currentPage: {
    type: Number,
    default: 1
  },
  hasNext: {
    type: Boolean,
    default: false
  },
  showPagination: {
    type: Boolean,
    default: true
  }
})

// Emits
defineEmits(['first', 'prev', 'next'])
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.board-content {
  display: flex;
  justify-content: flex-start;
  width: 1180px;
  margin: 0 auto; // 중앙 정렬

  .board-inner {
    width: 832px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .board-header {
      border: 1px solid #DDDDDD;
      padding: 24px;
      margin-bottom: 5px;

      .header-title {
        h1 {
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: #333333;
          margin: 0 0 8px 0;
        }

        .description {
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          margin: 0;
        }
      }
    }

    .board-footer {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}

@media (max-width: 768px) {
  .board-content {
    width: 100%;
    padding: 0 20px;

    .board-inner {
      width: 100%;

      .board-footer {
        margin-top: 16px;
      }
    }
  }
}
</style>
