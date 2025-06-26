import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/scss/style.scss'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import pinia from './stores';

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
