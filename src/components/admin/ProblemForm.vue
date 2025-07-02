<template>
  <div class="problem-form">
    <form @submit.prevent="handleSubmit" class="form-container">
      <!-- 일자 입력 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">일자 :</label>
          <input
            v-model="formData.problemDate"
            type="date"
            class="form-input date-input"
            :disabled="mode === 'edit' || isLoading"
            required
          />
        </div>
      </div>

      <!-- 제목 입력 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">제목 :</label>
          <input
            v-model="formData.title"
            type="text"
            class="form-input text-input"
            placeholder="문제 제목을 입력하세요"
            :disabled="isLoading"
            required
          />
        </div>
      </div>

      <!-- 설명 입력 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">설명 :</label>
          <textarea
            v-model="formData.description"
            class="form-input textarea-input"
            placeholder="문제 설명을 입력하세요"
            :disabled="isLoading"
            required
          ></textarea>
        </div>
      </div>

      <!-- 입력 설명 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">입력 설명 :</label>
          <textarea
            v-model="formData.inputDescription"
            class="form-input small-textarea"
            placeholder="입력 형식이나 제약 사항을 설명하세요 (선택사항)"
            :disabled="isLoading"
          ></textarea>
        </div>
      </div>

      <!-- 출력 설명 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">출력 설명 :</label>
          <textarea
            v-model="formData.outputDescription"
            class="form-input small-textarea"
            placeholder="출력 형식을 설명하세요 (선택사항)"
            :disabled="isLoading"
          ></textarea>
        </div>
      </div>

      <!-- 입력 예제 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">입력 예제 :</label>
          <textarea
            v-model="formData.sampleInput"
            class="form-input small-textarea"
            placeholder="입력 예제를 입력하세요 (선택사항)"
            :disabled="isLoading"
          ></textarea>
        </div>
      </div>

      <!-- 출력 예제 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">출력 예제 :</label>
          <textarea
            v-model="formData.sampleOutput"
            class="form-input small-textarea"
            placeholder="출력 예제를 입력하세요"
            :disabled="isLoading"
            required
          ></textarea>
        </div>
      </div>

      <!-- 히든 테스트 케이스 -->
      <div class="form-group">
        <div class="test-cases-section">
          <div class="test-cases-header">
            <label class="form-label">히든 테스트 케이스 :</label>
            <button
              type="button"
              @click="addTestCase"
              class="add-test-case-btn"
              :disabled="isLoading"
            >
              <i class="bi bi-plus-circle"></i>
              추가
            </button>
          </div>
          
          <div class="test-cases-list">
            <div
              v-for="(testCase, index) in formData.hiddenTestCases"
              :key="index"
              class="test-case-item"
            >
              <div class="test-case-header">
                <span class="test-case-number">테스트 케이스 {{ index + 1 }}</span>
                <button
                  type="button"
                  @click="removeTestCase(index)"
                  class="remove-test-case-btn"
                  :disabled="isLoading"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              
              <div class="test-case-content">
                <div class="test-case-field">
                  <label class="test-case-label">입력:</label>
                  <textarea
                    v-model="testCase.input"
                    class="test-case-input"
                    placeholder="입력 데이터 (없으면 비워두세요)"
                    :disabled="isLoading"
                  ></textarea>
                </div>
                
                <div class="test-case-field">
                  <label class="test-case-label">예상 출력:</label>
                  <textarea
                    v-model="testCase.expectedOutput"
                    class="test-case-input"
                    placeholder="예상 출력 결과"
                    :disabled="isLoading"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div v-if="formData.hiddenTestCases.length === 0" class="empty-test-cases">
              <p>히든 테스트 케이스가 없습니다. '추가' 버튼을 눌러 테스트 케이스를 추가하세요.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 시간 제한 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">시간 제한 :</label>
          <input
            v-model.number="formData.timeLimit"
            type="number"
            class="form-input small-input"
            placeholder="1000"
            min="100"
            max="10000"
            :disabled="isLoading"
            required
          />
          <span class="unit-text">ms</span>
        </div>
      </div>

      <!-- 메모리 제한 -->
      <div class="form-group">
        <div class="form-row">
          <label class="form-label">메모리 제한 :</label>
          <input
            v-model.number="formData.memoryLimit"
            type="number"
            class="form-input small-input"
            placeholder="128"
            min="64"
            max="512"
            :disabled="isLoading"
            required
          />
          <span class="unit-text">MB</span>
        </div>
      </div>

      <!-- 액션 버튼 -->
      <div class="form-actions">
        <button
          type="button"
          @click="handleBack"
          class="action-btn back-btn"
          :disabled="isLoading"
        >
          목록으로
        </button>
        <button
          type="submit"
          class="action-btn save-btn"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading">
            <i class="bi bi-arrow-clockwise spin"></i>
            처리중...
          </span>
          <span v-else>
            {{ mode === 'create' ? '생성' : '수정' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { defineProps, defineEmits } from 'vue'

// ===== Props =====
const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value)
  },
  problemData: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// ===== Emits =====
const emit = defineEmits(['save', 'back'])

// ===== 상태 관리 =====
const formData = ref({
  problemDate: '',
  title: '',
  description: '',
  inputDescription: '',
  outputDescription: '',
  sampleInput: '',
  sampleOutput: '',
  hiddenTestCases: [],
  timeLimit: 1000,
  memoryLimit: 128
})

// ===== Computed =====
const isFormValid = computed(() => {
  return formData.value.problemDate &&
         formData.value.title.trim() &&
         formData.value.description.trim() &&
         formData.value.sampleOutput.trim() &&
         formData.value.timeLimit > 0 &&
         formData.value.memoryLimit > 0
})

// ===== 폼 초기화 =====
function initializeForm() {
  if (props.mode === 'edit' && props.problemData) {
    // 수정 모드: 기존 데이터 로드
    formData.value = {
      problemDate: props.problemData.problemDate || '',
      title: props.problemData.title || '',
      description: props.problemData.description || '',
      inputDescription: props.problemData.inputDescription || '',
      outputDescription: props.problemData.outputDescription || '',
      sampleInput: props.problemData.sampleInput || '',
      sampleOutput: props.problemData.sampleOutput || '',
      hiddenTestCases: parseHiddenTestCases(props.problemData.hiddenTestCases) || [],
      timeLimit: props.problemData.timeLimit || 1000,
      memoryLimit: props.problemData.memoryLimit || 128
    }
  } else {
    // 생성 모드: 기본값 설정
    const today = new Date().toISOString().split('T')[0]
    formData.value = {
      problemDate: today,
      title: '',
      description: '',
      inputDescription: '',
      outputDescription: '',
      sampleInput: '',
      sampleOutput: '',
      hiddenTestCases: [],
      timeLimit: 1000,
      memoryLimit: 128
    }
  }
}

// ===== 테스트 케이스 관리 =====
function parseHiddenTestCases(hiddenTestCasesJson) {
  if (!hiddenTestCasesJson) return []
  
  try {
    const parsed = JSON.parse(hiddenTestCasesJson)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('히든 테스트 케이스 파싱 오류:', e)
    return []
  }
}

function addTestCase() {
  formData.value.hiddenTestCases.push({
    input: '',
    expectedOutput: ''
  })
}

function removeTestCase(index) {
  if (confirm('이 테스트 케이스를 삭제하시겠습니까?')) {
    formData.value.hiddenTestCases.splice(index, 1)
  }
}

// ===== 이벤트 핸들러 =====
function handleSubmit() {
  if (!isFormValid.value) {
    alert('모든 필수 항목을 입력해주세요.')
    return
  }

  // API 문서에 맞춰 데이터 준비
  const submitData = {
    problemDate: formData.value.problemDate,
    title: formData.value.title.trim(),
    description: formData.value.description.trim(),
    sampleInput: formData.value.sampleInput.trim(),
    sampleOutput: formData.value.sampleOutput.trim(),
    timeLimit: Number(formData.value.timeLimit),
    memoryLimit: Number(formData.value.memoryLimit)
  }
  
  // inputDescription과 outputDescription이 비어있지 않으면 추가
  if (formData.value.inputDescription?.trim()) {
    submitData.inputDescription = formData.value.inputDescription.trim()
  }
  if (formData.value.outputDescription?.trim()) {
    submitData.outputDescription = formData.value.outputDescription.trim()
  }
  
  // 히든 테스트 케이스 추가 (비어있지 않은 경우만)
  const validTestCases = formData.value.hiddenTestCases.filter(tc => 
    tc.expectedOutput && tc.expectedOutput.trim()
  )
  
  if (validTestCases.length > 0) {
    submitData.hiddenTestCases = validTestCases.map(tc => ({
      input: tc.input || '',
      expectedOutput: tc.expectedOutput.trim()
    }))
  }

  emit('save', submitData)
}

function handleBack() {
  if (hasChanges()) {
    const confirmed = confirm('변경사항이 있습니다. 정말 나가시겠습니까?')
    if (!confirmed) return
  }
  
  emit('back')
}

function hasChanges() {
  if (props.mode === 'create') {
    return formData.value.title.trim() ||
           formData.value.description.trim() ||
           formData.value.inputDescription.trim() ||
           formData.value.outputDescription.trim() ||
           formData.value.sampleInput.trim() ||
           formData.value.sampleOutput.trim() ||
           formData.value.hiddenTestCases.length > 0
  }
  
  if (props.mode === 'edit' && props.problemData) {
    const originalTestCases = parseHiddenTestCases(props.problemData.hiddenTestCases)
    const currentTestCases = formData.value.hiddenTestCases
    
    const testCasesChanged = JSON.stringify(originalTestCases) !== JSON.stringify(currentTestCases)
    
    return formData.value.title !== props.problemData.title ||
           formData.value.description !== props.problemData.description ||
           formData.value.inputDescription !== (props.problemData.inputDescription || '') ||
           formData.value.outputDescription !== (props.problemData.outputDescription || '') ||
           formData.value.sampleInput !== (props.problemData.sampleInput || '') ||
           formData.value.sampleOutput !== props.problemData.sampleOutput ||
           formData.value.timeLimit !== props.problemData.timeLimit ||
           formData.value.memoryLimit !== props.problemData.memoryLimit ||
           testCasesChanged
  }
  
  return false
}

// ===== Watchers =====
watch(() => props.problemData, () => {
  initializeForm()
}, { deep: true })

watch(() => props.mode, () => {
  initializeForm()
})

// ===== 라이프사이클 =====
onMounted(() => {
  initializeForm()
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.problem-form {
  padding: 20px;
  height: calc(100% - 40px);
  overflow-y: auto;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 100%;
}

.form-group {
  .form-row {
    height: 75px;
    padding: 22px 20px;
    border-bottom: 1px solid $dim-gray;
    display: flex;
    align-items: center;
    gap: 20px;
    background: $white;

    &:last-child {
      border-bottom: 1px solid $dim-gray;
    }

    .form-label {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
      white-space: nowrap;
      min-width: 100px;
    }

    .form-input {
      flex: 1;
      border: 1px solid $dim-gray;
      border-radius: 4px;
      padding: 8px 12px;
      font-family: $secondary-kr;
      font-size: 16px;
      line-height: 1.4;
      color: $dark-black;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: $main-color;
        box-shadow: 0 0 0 2px rgba($main-color, 0.1);
      }

      &:disabled {
        background-color: $silver-gray;
        color: $silver-black;
        cursor: not-allowed;
      }

      &::placeholder {
        color: $light-black;
      }
    }

    .date-input {
      max-width: 200px;
    }

    .text-input {
      max-width: 400px;
    }

    .textarea-input {
      min-height: 80px;
      resize: vertical;
      max-width: 500px;
    }

    .small-textarea {
      min-height: 60px;
      resize: vertical;
      max-width: 300px;
    }

    .small-input {
      max-width: 120px;
      text-align: center;
    }

    .unit-text {
      font-family: $secondary-kr;
      font-size: 14px;
      color: $silver-black;
      margin-left: 8px;
    }
  }

  // 특별한 레이아웃이 필요한 폼 그룹들
  &:nth-child(3) .form-row, // 설명
  &:nth-child(4) .form-row, // 입력 설명
  &:nth-child(5) .form-row, // 출력 설명
  &:nth-child(6) .form-row, // 입력 예제
  &:nth-child(7) .form-row { // 출력 예제
    min-height: 75px;
    height: auto;
    align-items: flex-start;
    padding-top: 22px;
    padding-bottom: 22px;

    .form-label {
      margin-top: 8px;
    }
  }
}

// 히든 테스트 케이스 스타일
.test-cases-section {
  padding: 20px;
  border-bottom: 1px solid $dim-gray;
  background: $white;

  .test-cases-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .form-label {
      font-family: $secondary-kr;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.252;
      color: $dark-black;
      margin: 0;
    }

    .add-test-case-btn {
      background: $main-color;
      color: $white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-family: $secondary-kr;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: darken($main-color, 10%);
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      i {
        font-size: 16px;
      }
    }
  }

  .test-cases-list {
    .test-case-item {
      background: $silver-gray;
      border: 1px solid $dim-gray;
      border-radius: 8px;
      margin-bottom: 15px;
      padding: 15px;

      .test-case-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .test-case-number {
          font-family: $secondary-kr;
          font-weight: 500;
          font-size: 16px;
          color: $dark-black;
        }

        .remove-test-case-btn {
          background: #dc3545;
          color: $white;
          border: none;
          border-radius: 4px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;

          &:hover:not(:disabled) {
            background: darken(#dc3545, 10%);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }

      .test-case-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;

        .test-case-field {
          .test-case-label {
            display: block;
            font-family: $secondary-kr;
            font-weight: 500;
            font-size: 14px;
            color: $dark-black;
            margin-bottom: 6px;
          }

          .test-case-input {
            width: 100%;
            min-height: 60px;
            border: 1px solid $dim-gray;
            border-radius: 4px;
            padding: 8px 12px;
            font-family: $secondary-kr;
            font-size: 14px;
            color: $dark-black;
            resize: vertical;
            transition: border-color 0.2s ease;

            &:focus {
              outline: none;
              border-color: $main-color;
              box-shadow: 0 0 0 2px rgba($main-color, 0.1);
            }

            &:disabled {
              background-color: darken($silver-gray, 5%);
              color: $silver-black;
              cursor: not-allowed;
            }

            &::placeholder {
              color: $light-black;
              font-size: 13px;
            }
          }
        }
      }
    }

    .empty-test-cases {
      text-align: center;
      padding: 30px 20px;
      color: $silver-black;
      background: $silver-gray;
      border: 1px dashed $dim-gray;
      border-radius: 8px;

      p {
        margin: 0;
        font-family: $secondary-kr;
        font-size: 14px;
        line-height: 1.4;
      }
    }
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 30px 0 20px;
  margin-top: auto;

  .action-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-family: $secondary-kr;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 100px;

    span {
      color: white;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .back-btn {
    background: $white;
    color: $dark-black;
    border: 1px solid $dim-gray;

    &:hover:not(:disabled) {
      background: $silver-gray;
      border-color: $light-black;
    }
  }

  .save-btn {
    background: $main-color;
    color: $white;

    &:hover:not(:disabled) {
      background: darken($main-color, 10%);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba($main-color, 0.3);
    }

    .spin {
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

</style>
