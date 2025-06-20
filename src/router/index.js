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
    meta: { showNav: true },
    children: [
      {
        path: 'calendar',
        component: CalendarPage,
        meta: { showNav: false },
      },
      {
        path: 'party',
        component: () => import('@/pages/PartyPage.vue'),
        meta: { showNav: false },
      },
      {
        path: 'notice',
        component: () => import('@/pages/NoticePage.vue'),
        meta: { showNav: false },
      },
      {
        path: 'admin',
        component: () => import('@/pages/AdminPage.vue'),
        meta: { showNav: false },
      },
      {
        path: 'mypage',
        component: () => import('@/pages/MyPage.vue'),
        meta: { showNav: false },
      },
      {
        path: 'chat',
        component: () => import('@/pages/ChatPage.vue'),
        meta: { showNav: false },
      },
      {
        path: 'free-board',
        component: () => import('@/pages/FreeBoard.vue')
      },
      {
        path: 'hot-board',
        component: () => import('@/pages/HotBoard.vue')
      },
      {
        path: 'share-board',
        component: () => import('@/pages/ShareBoard.vue')
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