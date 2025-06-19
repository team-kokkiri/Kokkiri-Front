import { createRouter, createWebHistory } from 'vue-router'
import FrontPage from '../pages/FrontPage.vue'
import SignUp from '../pages/SignUp.vue'
import LogIn from "@/pages/LogIn.vue";
import EmailVerify from "@/pages/EmailVerify.vue";
import FindPassword from "@/pages/FindPassword.vue";
import MainPage from "@/pages/MainPage.vue";
import ResetPassword from "@/pages/ResetPassword.vue";
import TeamCodeVerify from "@/pages/TeamCodeVerify.vue";
import CalendarPage from "@/pages/CalendarPage.vue";

const routes = [
  {
    path: '/main-page',
    component: MainPage,
    children: [
      {
        path: 'calendar',
        component: CalendarPage
      },
      {
        path: 'party',
        component: () => import('@/pages/PartyPage.vue')
      },
      {
        path: 'notice',
        component: () => import('@/pages/NoticePage.vue')
      },
      {
        path: 'admin',
        component: () => import('@/pages/AdminPage.vue')
      },
    ]
  },
  // 로그인/회원가입 등은 계속 루트에
  { path: '/', component: FrontPage },
  { path: '/signup', component: SignUp },
  { path: '/login', component: LogIn },
  { path: '/email-verify', component: EmailVerify },
  { path: '/find-password', component: FindPassword },
  { path: '/reset-password', component: ResetPassword },
  { path: '/teamcode-verify', component: TeamCodeVerify }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router