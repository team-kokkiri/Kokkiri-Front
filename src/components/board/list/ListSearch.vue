<template>
  <div class="search-box" v-if="visible">
    <input 
        type="text" 
        placeholder="검색어를 입력하세요"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        @input="handleInput"
    />
    <i class="bi bi-search" @click="handleSearch"></i>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

// Props
defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: '검색어를 입력하세요'
  }
})

// Emits
const emit = defineEmits(['search', 'input'])

// 검색어
const searchQuery = ref('')

// 검색 실행
function handleSearch() {
  emit('search', searchQuery.value.trim())
}

// 입력 이벤트
function handleInput() {
  emit('input', searchQuery.value)
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';
.search-box {
  display: flex;
  align-items: center;
  border: 2px solid $dim-gray;
  border-radius: 5px;
  height: 35px;
  width: 246px;
  padding: 0 14px;

  input[type="text"] {
    flex: 1 1 0;
    border: none;
    font-size: 14px;
    outline: none;
    background: transparent;

    &::placeholder {
      font-size: 14px;
      color: #777777;
    }
  }

  .bi-search {
    font-size: 18px;
    color: #777777;
    margin-left: 7px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #2196f3;
    }
  }
}
</style>
