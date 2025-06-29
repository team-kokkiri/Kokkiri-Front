<template>
  <button 
    class="action-button"
    :class="{ 'primary': primary, 'loading': loading }"
    :disabled="loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="loading-spinner"></span>
    {{ loading ? '처리 중...' : text }}
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  text: {
    type: String,
    required: true
  },
  primary: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.action-button {
  padding: 8px 15px;
  border-radius: 15px;
  border: none;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 90px;
  justify-content: center;
  
  // Default (secondary) button
  background: #f8f9fa;
  color: #333;
  
  &:hover:not(:disabled) {
    background: #e9ecef;
  }
  
  // Primary button
  &.primary {
    background: #2196f3;
    color: white;
    
    &:hover:not(:disabled) {
      background: #1976d2;
    }
  }
  
  // Loading state
  &.loading {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .loading-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
