<template>
  <div v-if="isVisible" class="modal-backdrop" @click="handleBackdropClick">
    <div class="modal-container" @click.stop>
      <!-- 아이콘 영역 -->
      <div class="modal-icon">
        <div class="icon-placeholder"></div>
      </div>

      <!-- 제목 영역 -->
      <div class="modal-title">
        {{ modalTitle }}
      </div>

      <!-- ...중략... -->
      <div class="form-section">
        <!-- 일정 제목 -->
        <div class="form-group">
          <label class="form-label"><span>제목 :</span></label>
          <template v-if="isEditMode">
            <input
                v-model="formData.title"
                type="text"
                class="form-input"
                placeholder="일정 제목을 입력하세요"
                ref="titleInput"
            >
          </template>
          <template v-else>
            <div class="form-label-content">
              <template v-for="(line, idx) in titleLines" :key="idx">
                <div>{{ line }}</div>
              </template>
            </div>
          </template>
        </div>

        <!-- 일정 내용 -->
        <div class="form-group">
          <label class="form-label-content"><span>내용 :</span></label>
          <template v-if="isEditMode">
      <textarea
          v-model="formData.description"
          class="form-textarea"
          placeholder="일정 내용을 입력하세요"
          rows="4"
      ></textarea>
          </template>
          <template v-else>
            <div class="form-label-content">
              <template v-for="(line, idx) in descriptionLines" :key="idx">
                <div>{{ line }}</div>
              </template>
            </div>
          </template>
        </div>
      </div>

      <!-- 버튼 영역 -->
      <div class="button-section">
        <template v-if="isEditMode">
          <button
              type="button"
              class="btn btn-register"
              @click="handleSubmit"
          >
            {{ selectedEventIsNull ? '등록' : '수정' }}
          </button>
          <button
              type="button"
              :class="['btn', 'btn-delete', { disabled: !isEditMode }]"
              @click="handleDelete"
              :disabled="!isEditMode"
          >
            삭제
          </button>
        </template>
        <template v-else>
          <button
              type="button"
              class="btn btn-register"
              @click="handleBackdropClick"
          >
            닫기
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  selectedDate: {
    type: String,
    default: ''
  },
  eventData: {
    type: Object,
    default: () => ({
      title: '',
      description: ''
    })
  }
})

// Emits
const emit = defineEmits(['close', 'submit', 'delete'])

// Refs
const titleInput = ref(null)

// Reactive data
const formData = ref({
  title: '',
  description: ''
})

const titleLines = computed(() => (formData.value.title || '').split('\n'));
const descriptionLines = computed(() => (formData.value.description || '').split('\n'));

// Computed
const modalTitle = computed(() => {
  if (props.isEditMode) {
    return `${props.selectedDate}\n일정을 수정해주세요!`
  }
  return `${props.selectedDate}\n일정을 입력해주세요!`
})

// Watch for prop changes
watch(() => props.eventData, (newData) => {
  console.log("모달 받은 eventData:", newData);
  formData.value = {
    title: newData.title || '',
    description: newData.description || ''
  }
}, { immediate: true, deep: true })

watch(() => props.isVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      titleInput.value?.focus()
    })
  }
})

const selectedEventIsNull = computed(() => props.eventData && !props.eventData.id)

// Methods
const handleBackdropClick = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    alert('제목을 입력해주세요!')
    return
  }

  emit('submit', {
    title: formData.value.title.trim(),
    description: formData.value.description.trim()
  })
}

const handleDelete = () => {
  if (!props.isEditMode) return

  if (confirm('정말 삭제하시겠습니까?')) {
    emit('delete')
  }
}

// Reset form when modal closes
watch(() => props.isVisible, (visible) => {
  if (!visible) {
    formData.value = {
      title: '',
      description: ''
    }
  }
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadein-bg 0.18s;
}

@keyframes fadein-bg {
  0% { background: rgba(0, 0, 0, 0); }
  100% { background: rgba(0, 0, 0, 0.3); }
}

.modal-container {
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
  animation: scalein 0.18s;
  overflow: hidden;
  padding-top: 10px;
}

@keyframes scalein {
  0% { transform: scale(0.98); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.modal-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 20px 0 20px ;
  height: 170px;
}

.icon-placeholder {
  width: 170px;
  height: 170px;
  background-image: url('@/assets/img/마스코트달력.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 8px;
}

.modal-title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.25;
  color: #333333;
  text-align: center;
  white-space: pre-line;
  margin-bottom: 10px;
}

.form-section {
  padding: 0 20px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.form-label {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  display: inline-block;
  width: 60px;
  margin-left: 28px;
  margin-bottom: 2px;
  margin-right: 0;
}

.form-label-content {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  display: inline-block;
  width: 100%;
  margin-left: 28px;
  margin-bottom: 2px;
  margin-right: 0;
  align-self: flex-start;
  padding-top: 8px;
}


.form-input,
.form-textarea {
  border: 1px solid #2196f3;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background: #ffffff;
}

.form-input {
  width: 239px;
  height: 26px;
}

.form-textarea {
  width: 239px;
  height: 100px;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #1976d2;
}

.button-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 39px;
  padding: 20px;
  height: 70px;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 15px;
  border: none;
  border-radius: 10px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100px;
  height: 30px;
}

.btn-register {
  background: #2196f3;
  color: #ffffff;
}

.btn-register:hover {
  background: #1976d2;
}

.btn-delete {
  background: #ed2040;
  color: #ffffff;
}

.btn-delete:hover:not(.disabled) {
  background: #d31a3a;
}

.btn-delete.disabled {
  background: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

/* 반응형 */
@media (max-width: 480px) {
  .modal-container {
    width: 90vw;
    margin: 0 20px;
  }
  
  .form-input,
  .form-textarea {
    width: 100%;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-label {
    width: auto;
    margin-right: 0;
  }
  
  .button-section {
    gap: 20px;
  }
  
  .btn {
    width: 80px;
  }
}
</style>