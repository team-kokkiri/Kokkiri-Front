<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="image-section">
          <img 
            src="../../../assets/img/마스코트채팅방생성.png"
            alt="채팅방 생성 마스코트"
            class="mascot-image"
          />
        </div>
        <div class="message-section">
          <p class="create-message">채팅방 이름을 입력해주세요!</p>
        </div>
        <div class="input-section">
          <div class="input-wrapper">
            <input 
              v-model="roomName" 
              type="text"
              class="room-name-input"
              placeholder="채팅방 이름을 입력하세요"
              @keyup.enter="createRoom"
              ref="nameInput"
            />
          </div>
          <button 
            class="btn-create" 
            @click="createRoom"
            :disabled="!roomName.trim()"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateRoomModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'success'],
  data() {
    return {
      roomName: ''
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // 모달이 열릴 때 입력창 초기화 및 포커스
        this.roomName = ''
        this.$nextTick(() => {
          if (this.$refs.nameInput) {
            this.$refs.nameInput.focus()
          }
        })
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    async createRoom() {
      const trimmedName = this.roomName.trim()
      if (!trimmedName) {
        alert('채팅방 이름을 입력해주세요.')
        return
      }

      try {
        const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'
        const token = localStorage.getItem('accessToken')

        if (!token) {
          alert('로그인이 필요합니다.')
          return
        }

        const formData = new URLSearchParams()
        formData.append('roomName', trimmedName)

        const response = await axios.post(`${API_BASE_URL}/api/chat/room/group/create`, formData.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
          }
        })

        if ([200, 201].includes(response.status)) {
          const newRoom = response.data
          alert(`'${trimmedName}' 채팅방이 성공적으로 개설되었습니다.`)
          this.$emit('success', newRoom)
          this.closeModal()
        } else {
          throw new Error('채팅방 생성에 실패했습니다.')
        }
      } catch (error) {
        console.error('채팅방 생성 실패:', error)
        if (error.response) {
          const errorMessage = error.response.data?.message || `서버 오류: ${error.response.status}`
          alert(`채팅방 개설에 실패했습니다. ${errorMessage}`)
        } else if (error.request) {
          alert('서버로부터 응답이 없습니다. 네트워크나 서버 상태를 확인해주세요.')
        } else {
          alert('요청 중 오류가 발생했습니다.')
        }
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
  padding-top: 10px;
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

.create-message {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.252;
  color: #333333;
  text-align: center;
  margin: 0;
}

.input-section {
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 69px 8px 58px;
  gap: 20px;
}

.input-wrapper {
  width: 194px;
  height: 26px;
  position: relative;
}

.room-name-input {
  width: 100%;
  height: 100%;
  border: 1px solid #DDDDDD;
  border-radius: 10px;
  background: #FFFFFF;
  padding: 5px 10px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.252;
  color: #000000;
  box-sizing: border-box;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #2196F3;
  }
}

.btn-create {
  width: 60px;
  height: 26px;
  padding: 8px 15px;
  background: #2196F3;
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
