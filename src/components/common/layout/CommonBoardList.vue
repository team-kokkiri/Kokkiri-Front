<template>
  <div class="common-board-list">
    <CommonBoardItem
        v-for="item in items"
        :key="getItemKey(item)"
        :item="item"
        :config="config"
        @click="handleItemClick"
    />

    <!-- 게시글이 없을 때 -->
    <div v-if="items.length === 0" class="empty-state">
      <p>{{ config.emptyMessage || '게시물이 없습니다.' }}</p>
      <span>{{ config.emptyDescription || '게시물을 작성하면 여기에 표시됩니다.' }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import CommonBoardItem from './CommonBoardItem.vue'

// Props
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({
      showBoardType: false,
      showPreview: false,
      emptyMessage: '게시물이 없습니다.',
      emptyDescription: '게시물을 작성하면 여기에 표시됩니다.'
    })
  }
})

// Emits
const emit = defineEmits(['itemClick'])

// 아이템의 고유 키 생성
function getItemKey(item) {
  return item.id || item.boardId || item.idx
}

// 아이템 클릭 핸들러
function handleItemClick(data) {
  emit('itemClick', data)
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.common-board-list {
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
