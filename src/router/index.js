import { createRouter, createWebHistory } from 'vue-router'
import FrontPage from '../pages/FrontPage.vue'

const routes = [
  {
    path: '/',
    name: 'FrontPage',
    component: FrontPage
  },
  // 기타 라우트들...
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router