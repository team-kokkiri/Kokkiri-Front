import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/scss/style.scss'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import pinia from './stores';
import { useUserStore } from '@/stores/user';  // ← 수정!

// 앱 생성
const app = createApp(App)

app.use(router)
   .use(Vue3Toastify, {
       position: "top-center",
       autoClose: 2000,
       icon: false,
   })
   .use(pinia)

// 앱 마운트
app.mount('#app')

// localStorage에서 토큰 복원 (Pinia 사용)
const userStore = useUserStore()
userStore.restoreUser()
