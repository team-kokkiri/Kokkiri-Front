import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/scss/style.scss'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import store from './store';

// 앱 생성
const app = createApp(App)

app.use(router)
   .use(Vue3Toastify, {
       position: "top-center",
       autoClose: 2000,
       icon: false,
   })
   .use(store)

// 앱 마운트 후 토큰 복원
app.mount('#app')

// localStorage에서 토큰 복원
store.dispatch('user/restoreUser')