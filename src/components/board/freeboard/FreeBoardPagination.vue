<template>
  <div class="pagination" :class="{ single: currentPage === 1 }">
    <div class="pagination-left">
      <button
          v-if="currentPage > 2"
          class="btn-first"
          @click="goFirst"
      >
        <i class="bi bi-chevron-double-left"></i>
        처음
      </button>
      <button
          v-if="currentPage > 1"
          type="button"
          class="btn-prev"
          @click="goPrev"
      >
        <i class="bi bi-chevron-left"></i>
        이전
      </button>
    </div>
    
    <!-- 페이지 번호 표시 (선택사항) -->
    <div class="page-numbers" v-if="showPageNumbers">
      <button
          v-for="page in visiblePages"
          :key="page"
          class="btn-page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>
    
    <button
        type="button"
        class="btn-next"
        @click="goNext"
        :disabled="!hasNext"
    >
      다음
      <i class="bi bi-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  hasNext: {
    type: Boolean,
    default: true
  },
  showPageNumbers: {
    type: Boolean,
    default: false
  },
  visiblePageCount: {
    type: Number,
    default: 5
  }
})

// Emits
const emit = defineEmits(['first', 'prev', 'next', 'page'])

// 표시할 페이지 번호들 계산
const visiblePages = computed(() => {
  if (!props.showPageNumbers) return []
  
  const { currentPage, totalPages, visiblePageCount } = props
  const half = Math.floor(visiblePageCount / 2)
  
  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, start + visiblePageCount - 1)
  
  // 끝 페이지에 맞춰 시작 페이지 조정
  if (end - start + 1 < visiblePageCount) {
    start = Math.max(1, end - visiblePageCount + 1)
  }
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 페이지 이동 함수들
function goFirst() {
  if (props.currentPage > 1) {
    emit('first')
  }
}

function goPrev() {
  if (props.currentPage > 1) {
    emit('prev')
  }
}

function goNext() {
  if (props.hasNext) {
    emit('next')
  }
}

function goToPage(page) {
  if (page !== props.currentPage) {
    emit('page', page)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';
.pagination {
  display: flex;
  justify-content: space-between;
  width: 832px;

  &.single {
    justify-content: flex-end;
  }

  .pagination-left {
    display: flex;
    gap: 5px;
  }

  .page-numbers {
    display: flex;
    gap: 4px;
  }

  .btn-first,
  .btn-prev,
  .btn-next,
  .btn-page {
    border: 1px solid $crimson;
    background: white;
    color: #ed2040;
    font-size: 14px;
    font-weight: 500;
    border-radius: 5px;
    height: 35px;
    cursor: pointer;
    transition: background 0.12s;
    padding: 0 12px;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      opacity: 0.9;
    }

    .bi {
      color: #ed2040;
    }
  }

  .btn-next:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-page {
    min-width: 36px;
    justify-content: center;

    &.active {
      background: #2196f3;
      border-color: #2196f3;
      color: #fff;

      &:hover {
        background: #1976d2;
        border-color: #1976d2;
      }
    }
  }

  .btn-first {
    margin-right: 5px;
  }

  .bi-chevron-double-left,
  .bi-chevron-left,
  .bi-chevron-right {
    color: #ed2040;
    font-size: 12px;
  }
}
</style>
