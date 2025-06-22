<template>
  <div class="board-free-list">
    <FreeBoardItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @click="handleItemClick"
    />
    
    <!-- 게시글이 없을 때 -->
    <div v-if="items.length === 0" class="empty-state">
      <p>등록된 게시글이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import FreeBoardItem from './FreeBoardItem.vue'

// Props
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['itemClick'])

// 아이템 클릭 핸들러
function handleItemClick(itemId) {
  emit('itemClick', itemId)
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';
.board-free-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  p {
    margin: 0;
    font-size: 14px;
  }
}
</style>
