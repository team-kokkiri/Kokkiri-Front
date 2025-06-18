import { createRouter, createWebHistory } from 'vue-router'
import FrontPage from '../pages/FrontPage.vue'
import SignUp from '../pages/SignUp.vue'
import LogIn from "@/pages/LogIn.vue";

const routes = [
  {
    path: '/',
    name: 'FrontPage',
    component: FrontPage
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn
  },
  // 기타 라우트들...
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router