import { createRouter, createWebHistory } from 'vue-router'
import FrontPage from '../pages/FrontPage.vue'
import SignUp from '../pages/SignUp.vue'
import LogIn from "@/pages/LogIn.vue";
import EmailVerify from "@/pages/EmailVerify.vue";
import FindPassword from "@/pages/FindPassword.vue";
import MainPage from "@/pages/MainPage.vue";
import ResetPassword from "@/pages/ResetPassword.vue";

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
  {
    path: '/email-verify',
    name: 'EmailVerify',
    component: EmailVerify
  },
  {
    path: '/find-password',
    name: 'FindPassword',
    component: FindPassword
  },
  {
    path: '/main-page',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router