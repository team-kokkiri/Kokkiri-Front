<template>
  <div class="hot-board-list">
    <HotListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @click="handleItemClick"
    />

    <!-- 게시글이 없을 때 -->
    <div v-if="items.length === 0" class="empty-state">
      <p>HOT 게시물이 없습니다.</p>
      <span>좋아요 10개 이상을 받은 게시물이 여기에 표시됩니다.</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import HotListItem from './HotListItem.vue'

// Props
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['itemClick'])

// 아이템 클릭 핸들러 - 게시판 종류와 ID를 함께 전달
function handleItemClick({ id, route }) {
  emit('itemClick', { id, route })
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.hot-board-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  p {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 500;
    color: #666;
  }

  span {
    font-size: 14px;
    color: #999;
  }
}
</style>