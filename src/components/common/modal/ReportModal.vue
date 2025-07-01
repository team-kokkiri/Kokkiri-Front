<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="image-section">
          <img 
            src="../../../assets/img/마스코트신고.png"
            alt="신고 마스코트"
            class="mascot-image"
          />
        </div>
        <div class="message-section">
          <p class="report-message">신고 사유를 선택해주세요!</p>
        </div>
        <div class="dropdown-section">
          <div class="dropdown-wrapper">
            <select 
              v-model="selectedReason" 
              class="reason-dropdown"
              @change="updateSelectedReason"
            >
              <option value="" disabled>드롭다운으로 선택</option>
              <option 
                v-for="reason in reportReasons" 
                :key="reason.code" 
                :value="reason.code"
              >
                {{ reason.description }}
              </option>
            </select>
          </div>
          <button 
            class="btn-submit" 
            @click="submitReport"
            :disabled="!selectedReason"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ReportModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    targetId: {
      type: [Number, String],
      required: true
    },
    reportType: {
      type: String,
      required: true,
      validator: (value) => ['POST', 'COMMENT', 'REPLY'].includes(value)
    }
  },
  emits: ['close', 'success'],
  data() {
    return {
      selectedReason: '',
      reportReasons: [
        {
          code: "INAPPROPRIATE_CONTENT",
          description: "게시판 성격에 부적절함"
        },
        {
          code: "ABUSIVE_LANGUAGE",
          description: "욕설/비하"
        },
        {
          code: "INAPPROPRIATE_MEETING",
          description: "음란물/불건전한 만남 및 대화"
        },
        {
          code: "COMMERCIAL_AD",
          description: "상업적 광고 및 판매"
        },
        {
          code: "LEAK_OR_FRAUD",
          description: "유출/사칭/사기"
        },
        {
          code: "TROLLING_OR_SPAM",
          description: "낚시/놀람/도배"
        },
        {
          code: "POLITICAL_CONTENT",
          description: "정당/정치인 비하 및 선거운동"
        },
        {
          code: "ILLEGAL_CONTENT",
          description: "불법촬영물 등의 유통"
        }
      ]
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.resetForm()
      } else {
        // 모달이 열릴 때 DOM이 완전히 렌더링되도록 nextTick 사용
        this.$nextTick(() => {
          // 추가적인 초기화 로직이 필요하면 여기에
        })
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    updateSelectedReason() {
      // 선택 변경 시 추가 로직이 필요하면 여기에
    },
    resetForm() {
      this.selectedReason = ''
    },
    async submitReport() {
      if (!this.selectedReason) {
        alert('신고 사유를 선택해주세요.')
        return
      }

      try {
        const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'
        const token = localStorage.getItem('accessToken')

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }

        const requestData = {
          targetId: this.targetId,
          reportType: this.reportType,
          reportReason: this.selectedReason
        }

        const response = await axios.post(`${API_BASE_URL}/api/reports`, requestData, config)

        if ([200, 201].includes(response.status)) {
          alert('신고가 접수되었습니다.')
          this.$emit('success', {
            targetId: this.targetId,
            reportType: this.reportType,
            reportReason: this.selectedReason
          })
          this.closeModal()
        } else {
          throw new Error('신고 제출에 실패했습니다.')
        }
      } catch (error) {
        console.error('신고 실패:', error)
        const errorMessage = error.response?.data?.message || '신고 처리 중 오류가 발생했습니다.'
        alert(errorMessage)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 25vh;
  z-index: 1000;
}

.modal-container {
  width: 400px;
  height: 300px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.image-section {
  height: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.mascot-image {
  width: 170px;
  height: 170px;
  object-fit: cover;
}

.message-section {
  height: 47px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.report-message {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.252;
  color: #333333;
  text-align: center;
  margin: 0;
}

.dropdown-section {
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 69px 8px 69px;
  gap: 20px;
}

.dropdown-wrapper {
  width: 183px;
  height: 26px;
  position: relative;
}

.reason-dropdown {
  width: 100%;
  height: 100%;
  border: 1px solid #DDDDDD;
  background: #FFFFFF;
  padding: 5px 10px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.252;
  color: #000000;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2196F3;
  }

  option {
    padding: 5px;
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    font-size: 12px;
  }

  // 커스텀 드롭다운 화살표
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23999' d='M8 12l-4-4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  padding-right: 30px;
}

.btn-submit {
  width: 60px;
  height: 26px;
  padding: 8px 15px;
  background: #ED2040;
  color: #FFFFFF;
  border: none;
  border-radius: 15px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.252;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:active:not(:disabled) {
    opacity: 0.6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
