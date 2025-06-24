# 🎯 토큰 기반 인증 - Vuex → Pinia 마이그레이션 체크리스트

## ✅ 완료된 작업

### 1. 기본 설정
- [x] Pinia 패키지 추가 (`package.json` 업데이트)
- [x] `src/stores/` 디렉토리 생성
- [x] Pinia 설정 파일 생성 (`src/stores/index.js`)
- [x] User store 변환 (`src/stores/user.js`) - **토큰 기반으로 최적화**
- [x] `main.js`에서 Pinia 설정 적용
- [x] 기존 Vuex 파일들 백업 (`.backup` 확장자로 이름 변경)

### 2. 토큰 기반 구조로 변경
- [x] **State 구조 최적화**: `userId`, `nickname` 제거, `email`, `role`, `avatar`만 유지
- [x] **JWT 토큰 자동 디코딩** 기능 추가
- [x] **displayName getter** 추가 (이메일 기반 사용자 이름)
- [x] **토큰 갱신** 기능 추가
- [x] **토큰 만료 확인** 로직 추가

### 3. 문서화
- [x] 마이그레이션 가이드 문서 업데이트 (`PINIA_MIGRATION.md`)
- [x] 토큰 기반 컴포넌트 사용 예시 생성 (`PiniaUsageExample.vue`)
- [x] 완료 체크리스트 업데이트 (이 파일)

## 🔄 다음 할 일

### 1. 패키지 설치
```bash
npm install pinia
```

### 2. JWT 토큰 구조 확인
서버에서 제공하는 JWT 토큰에 다음 정보가 포함되어 있는지 확인:

```json
{
  "email": "user@example.com",
  "role": "user",  
  "avatar": "https://example.com/avatar.jpg",
  "exp": 1640995200,
  "iat": 1640908800
}
```

**다른 필드명을 사용하는 경우** `src/stores/user.js`의 토큰 디코딩 부분을 수정하세요:
```javascript
const tokenData = {
  email: decodedToken.email || decodedToken.sub || decodedToken.username,
  role: decodedToken.role || decodedToken.authorities?.[0] || decodedToken.scope,
  avatar: decodedToken.avatar || decodedToken.picture || decodedToken.profile_image
}
```

### 3. 기존 컴포넌트들 업데이트

#### 3.1 변경해야 할 코드 패턴들

**❌ 제거된 필드들 (더 이상 사용 불가)**
```javascript
// 이런 코드들을 찾아서 변경하세요
store.getters['user/currentUser'].id          // userId 제거됨
store.getters['user/currentUser'].nickname    // nickname 제거됨
store.getters['user/userId']                  // userId 제거됨
store.state.user.userId                       // userId 제거됨
store.state.user.nickname                     // nickname 제거됨
```

**✅ 새로운 패턴으로 변경**
```javascript
// 변경 후
userStore.currentUser.email                   // 이메일 (고유 식별자로 사용)
userStore.displayName                         // 표시 이름 (이메일 @ 앞부분)
userStore.currentUser.email                   // 사용자 식별용
```

#### 3.2 Import 및 기본 사용법 변경
```javascript
// Before
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
const currentUser = computed(() => store.getters['user/currentUser'])

// After
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
// computed() 불필요 - Pinia가 자동으로 반응형
```

#### 3.3 로그인 로직 변경
```javascript
// Before (Vuex)
await store.dispatch('user/login', {
  userInfo: { 
    userId: 1, 
    nickname: '사용자', 
    email: 'user@example.com',
    role: 'user',
    avatar: null 
  },
  token: 'jwt-token'
})

// After (Pinia) - 토큰 정보만 필요
await userStore.login({
  tokenData: { 
    email: 'user@example.com',
    role: 'user',
    avatar: 'avatar-url'
  },
  token: 'jwt-token'
})

// 또는 토큰만으로 자동 로그인
localStorage.setItem('accessToken', 'jwt-token')
await userStore.restoreUser() // 토큰 자동 디코딩
```

### 4. 검색해야 할 파일들
다음 명령어로 변경이 필요한 코드를 찾을 수 있습니다:

```bash
# Vuex 관련 import 찾기
grep -r "from 'vuex'" src/
grep -r "useStore" src/

# 제거된 필드 사용 찾기
grep -r "userId" src/
grep -r "nickname" src/
grep -r "currentUser\.id" src/

# store 사용 패턴 찾기
grep -r "store\.dispatch.*user" src/
grep -r "store\.getters.*user" src/
grep -r "store\.commit.*user" src/
```

### 5. 템플릿에서 사용법 변경

#### 5.1 사용자 정보 표시
```vue
<!-- Before -->
<template>
  <div v-if="isLoggedIn">
    <h1>안녕하세요, {{ currentUser.nickname }}님!</h1>
    <p>ID: {{ currentUser.id }}</p>
    <p>이메일: {{ currentUser.email }}</p>
  </div>
</template>

<!-- After -->
<template>
  <div v-if="userStore.isLoggedIn">
    <h1>안녕하세요, {{ userStore.displayName }}님!</h1>
    <p>이메일: {{ userStore.currentUser.email }}</p>
    <p>역할: {{ userStore.currentUser.role }}</p>
  </div>
</template>
```

#### 5.2 권한 체크
```vue
<!-- Before -->
<template>
  <button v-if="isAdmin" @click="adminAction">관리자 기능</button>
  <div v-if="currentUser.id === postAuthorId">수정 가능</div>
</template>

<!-- After -->
<template>
  <button v-if="userStore.isAdmin" @click="adminAction">관리자 기능</button>
  <div v-if="userStore.currentUser.email === postAuthorEmail">수정 가능</div>
</template>
```

### 6. API 호출 시 사용자 정보 변경

#### 6.1 게시글 작성/수정 시
```javascript
// Before
const postData = {
  title: '제목',
  content: '내용',
  authorId: store.getters['user/userId'],
  authorName: store.getters['user/currentUser'].nickname
}

// After
const postData = {
  title: '제목',
  content: '내용',
  authorEmail: userStore.currentUser.email,
  authorName: userStore.displayName
}
```

#### 6.2 프로필 업데이트
```javascript
// Before
await store.dispatch('user/updateProfile', {
  nickname: '새 닉네임',
  avatar: 'new-avatar.jpg'
})

// After - avatar만 변경 가능 (email, role은 토큰에서만)
await userStore.updateProfile({
  avatar: 'new-avatar.jpg'
})
```

### 7. 라우터 가드 업데이트
```javascript
// Before (router/index.js)
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['user/isLoggedIn']
  const isAdmin = store.getters['user/isAdmin']
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/unauthorized')
  } else {
    next()
  }
})

// After
import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/unauthorized')
  } else {
    next()
  }
})
```

### 8. 테스트
마이그레이션 완료 후 다음을 확인하세요:

- [ ] **로그인 기능**: 토큰 기반 로그인 정상 동작
- [ ] **자동 로그인**: 페이지 새로고침 시 토큰에서 정보 복원
- [ ] **로그아웃 기능**: 로그아웃 시 모든 정보 삭제
- [ ] **권한 확인**: admin/user 권한 체크 정상 동작
- [ ] **토큰 만료**: 만료된 토큰 처리 정상 동작
- [ ] **프로필 업데이트**: avatar 변경 기능 정상 동작
- [ ] **사용자 표시**: displayName이 올바르게 표시

### 9. 서버 API와의 호환성 확인

#### 9.1 JWT 토큰 페이로드 확인
```javascript
// JWT 디코딩 테스트
import { jwtDecode } from 'jwt-decode'
const token = 'your-jwt-token-here'
const decoded = jwtDecode(token)
console.log('토큰 내용:', decoded)

// 필요한 필드들이 있는지 확인
console.log('Email:', decoded.email)
console.log('Role:', decoded.role) 
console.log('Avatar:', decoded.avatar)
```

#### 9.2 API 엔드포인트 업데이트
서버 API에서 사용자 식별을 `userId` 대신 `email`로 변경해야 할 수 있습니다:

```javascript
// Before
GET /api/posts?authorId=123
POST /api/posts { authorId: 123, title: "..." }

// After  
GET /api/posts?authorEmail=user@example.com
POST /api/posts { authorEmail: "user@example.com", title: "..." }
```

### 10. 선택사항 (권장)

#### 10.1 Pinia 플러그인 추가
```bash
# 상태 지속성을 위한 플러그인
npm install pinia-plugin-persistedstate
```

```javascript
// stores/index.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
```

#### 10.2 TypeScript 지원 (사용 중인 경우)
```typescript
// stores/user.ts
export interface UserState {
  email: string | null
  role: 'admin' | 'user' | null
  avatar: string | null
  token: string | null
  isLoggedIn: boolean
  lastLoginAt: string | null
}
```

### 11. 정리
모든 마이그레이션이 완료되고 테스트가 끝나면:

- [ ] `.backup` 파일들 삭제
- [ ] `package.json`에서 `vuex` 의존성 제거: `npm uninstall vuex`
- [ ] `src/store/` 디렉토리 삭제
- [ ] 문서 업데이트 (README.md 등)

## 🆘 문제 해결

### 흔한 문제들

1. **"userId is undefined"**: userId를 email로 변경하세요
2. **"nickname is undefined"**: displayName getter를 사용하세요
3. **토큰 디코딩 오류**: JWT 토큰 형식과 필드명을 확인하세요
4. **권한 체크 실패**: role 값이 올바른지 확인하세요

### 도움이 필요한 경우
- JWT 토큰 디버깅: https://jwt.io/
- Pinia 공식 문서: https://pinia.vuejs.org/
- Vue DevTools에서 Pinia 탭 확인

## 🎉 마이그레이션 완료!

모든 체크리스트를 완료하면 **토큰 기반의 효율적인 사용자 관리 시스템**으로 업그레이드됩니다!

### 주요 개선사항
- ✨ **더 안전한 인증**: JWT 토큰 기반 
- 🚀 **더 간단한 코드**: Pinia의 직관적인 API
- 🎯 **최적화된 상태**: 필요한 정보만 관리
- 🔄 **자동 토큰 처리**: 만료 확인 및 갱신 지원
