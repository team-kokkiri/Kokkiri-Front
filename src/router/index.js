import { createRouter, createWebHistory } from 'vue-router'
import FrontPage from '../pages/FrontPage.vue'
import SignUp from '../pages/auth/SignUp.vue'
import LogIn from "@/pages/auth/LogIn.vue";
import EmailVerify from "@/pages/auth/EmailVerify.vue";
import FindPassword from "@/pages/auth/FindPassword.vue";
import MainPage from "@/pages/main/MainPage.vue";
import ResetPassword from "@/pages/auth/ResetPassword.vue";
import TeamCodeVerify from "@/pages/auth/TeamCodeVerify.vue";
import CalendarPage from "@/pages/main/CalendarPage.vue";

const routes = [
  {
    path: '/main-page',
    component: MainPage,
    meta: { showNav: true, showRight: true },
    children: [
      {
        path: 'calendar',
        component: CalendarPage,
        meta: { showNav: false, showRight: false },
      },
      {
        path: 'party',
        component: () => import('@/pages/main/PartyPage.vue'),
        meta: { showNav: false, showRight: false },
      },
      {
        path: 'notice',
        component: () => import('@/pages/board/NoticePage.vue'),
        meta: { showNav: false },
      },
      {
        path: 'admin',
        component: () => import('@/pages/admin/AdminPage.vue'),
        meta: { showNav: false, showRight: false },
      },
      {
        path: 'mypage',
        component: () => import('@/pages/user/MyPage.vue'),
        meta: { showNav: false, showRight: false },
      },
      {
        path: 'chat',
        component: () => import('@/pages/chat/ChatPage.vue'),
        meta: { showNav: false, showRight: false },
      },
      {
        path: 'free-board',
        component: () => import('@/pages/board/FreeBoard.vue')
      },
      {
        path: 'free-board/:id',
        component: () => import('@/pages/board/FreeBoardDetail.vue'),
        props: true,
      },
      {
        path: 'hot-board',
        component: () => import('@/pages/board/HotBoard.vue')
      },
      {
        path: 'share-board',
        component: () => import('@/pages/board/ShareBoard.vue')
      },
    ]
  },
    //oauth2 토큰저장페이지
  {
    path: '/oauth2-redirect',
    component: () => import('@/pages/auth/Oauth2Redirect.vue'),
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