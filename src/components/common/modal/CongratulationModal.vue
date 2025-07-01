<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="mascot-section">
        <img src="../../../assets/img/마스코트축하.png" alt="축하 마스코트" class="mascot-image" />
      </div>
      
      <div class="message-section">
        <p class="congratulation-text">
          축하합니다!<br>
          오늘 당신의 순위는 {{ rank }}등!
        </p>
      </div>
      
      <div class="progress-section">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressWidth + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  rank: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const progressWidth = ref(0)

// 모달이 보여질 때 프로그래스 바 애니메이션과 페이지 이동 처리
watch(() => props.isVisible, async (newValue) => {
  if (newValue) {
    // 다음 틱에서 프로그래스 바 시작
    await nextTick()
    progressWidth.value = 100
    
    // 2초 후 페이지 이동
    setTimeout(() => {
      emit('close')
      router.push('/main-page/daily-ranking')
    }, 2000)
  } else {
    // 모달이 닫힐 때 프로그래스 리셋
    progressWidth.value = 0
  }
})
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
  justify-content: center;
  align-items: flex-start;
  padding-top: 25vh;
  z-index: 1000;
}

.modal-content {
  width: 400px;
  height: 300px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.mascot-section {
  height: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  
  .mascot-image {
    width: 170px;
    height: 170px;
    object-fit: contain;
  }
}

.message-section {
  height: 109px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 5px 30px;
  
  .congratulation-text {
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 1.252;
    text-align: center;
    color: #333333;
    margin: 0;
    white-space: pre-line;
  }
}

.progress-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  
  .progress-bar {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background-color: #2196F3;
      transition: width 2s linear;
    }
  }
}
</style>
