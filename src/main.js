import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/scss/style.scss'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

createApp(App)
    .use(router)
    .use(Vue3Toastify, {
        position: "top-center",
        autoClose: 2000,
        icon: false,
    })
    .mount('#app')