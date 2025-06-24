# 📧 토큰 기반 사용자 정보 관리 - Vuex → Pinia 마이그레이션 가이드

## 🔄 변경사항 요약

토큰에서 **email, role, avatar** 3가지 정보만 추출하여 사용하도록 최적화되었습니다.

### 기존 구조 (Vuex)
```javascript
state: {
  userId: null,      // 제거됨
  nickname: null,    // 제거됨
  email: null,       // 토큰에서 추출
  role: null,        // 토큰에서 추출
  avatar: null,      // 토큰에서 추출
  token: null,
  isLoggedIn: false,
  lastLoginAt: null,
}
```

### 새로운 구조 (Pinia)
```javascript
state: {
  email: null,       // JWT 토큰에서 추출
  role: null,        // JWT 토큰에서 추출  
  avatar: null,      // JWT 토큰에서 추출
  token: null,       // JWT 토큰 원본
  isLoggedIn: false,
  lastLoginAt: null,
}
```

## 🎯 주요 기능

### 1. 토큰 자동 디코딩
JWT 토큰을 자동으로 디코딩하여 필요한 정보를 추출합니다:

```javascript
// 로그인 시
const result = await userStore.login({
  tokenData: { email, role, avatar }, // 서버에서 디코딩된 정보
  token: 'jwt-token-string'
})

// 또는 토큰만으로 자동 복원
await userStore.restoreUser() // localStorage의 토큰을 자동 디코딩
```

### 2. 새로운 Getters

```javascript
// 사용자 표시 이름 (이메일의 @ 앞부분)
userStore.displayName // "user@example.com" → "user"

// 현재 사용자 정보
userStore.currentUser // { email, role, avatar, lastLoginAt }

// 권한 확인
userStore.isAdmin  // role === 'admin'
userStore.isUser   // role === 'user'
```

## 📝 컴포넌트 사용법

### Before (Vuex)
```javascript
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
const currentUser = computed(() => store.getters['user/currentUser'])

// 로그인
await store.dispatch('user/login', {
  userInfo: { userId: 1, nickname: 'test', email: 'test@example.com' },
  token: 'jwt-token'
})
```

### After (Pinia)
```javascript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
// computed() 불필요 - 자동으로 반응형

// 로그인 (토큰 정보만 필요)
await userStore.login({
  tokenData: { email: 'test@example.com', role: 'user', avatar: 'url' },
  token: 'jwt-token'
})

// 템플릿에서 직접 사용
// {{ userStore.displayName }}
// {{ userStore.currentUser.email }}
// {{ userStore.isAdmin }}
```

## 🔧 API 변경사항

### 로그인 방법
```javascript
// 방법 1: 서버에서 이미 디코딩된 데이터 사용
await userStore.login({
  tokenData: {
    email: 'user@example.com',
    role: 'user', 
    avatar: 'https://example.com/avatar.jpg'
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
})

// 방법 2: 토큰만 있는 경우 (자동 디코딩)
localStorage.setItem('accessToken', 'jwt-token')
await userStore.restoreUser() // 자동으로 토큰 디코딩 후 정보 추출
```

### 사용자 정보 접근
```javascript
// 기본 정보
userStore.email         // 'user@example.com'
userStore.role          // 'user' 또는 'admin'
userStore.avatar        // 'https://...' 또는 null

// Getters
userStore.displayName   // 'user' (이메일의 @ 앞부분)
userStore.isAdmin       // true/false
userStore.isUser        // true/false
userStore.isLoggedIn    // true/false
userStore.hasToken      // true/false

// 전체 사용자 객체
userStore.currentUser   // { email, role, avatar, lastLoginAt }
```

### 프로필 업데이트
```javascript
// avatar만 변경 가능 (email, role은 토큰에서만 관리)
await userStore.updateProfile({
  avatar: 'new-avatar-url.jpg'
})
```

### 토큰 갱신
```javascript
// 새 토큰으로 정보 자동 업데이트
await userStore.refreshToken('new-jwt-token')
```

## 🛠️ 마이그레이션 단계

### 1. 패키지 설치
```bash
npm install pinia
```

### 2. 기존 컴포넌트 업데이트
다음 패턴을 찾아서 변경하세요:

```javascript
// 🔍 찾을 패턴들
store.getters['user/currentUser'].id          // userId 제거됨
store.getters['user/currentUser'].nickname    // nickname 제거됨
store.getters['user/userId']                  // userId 제거됨

// ✅ 새로운 패턴
userStore.currentUser.email                   // 이메일 사용
userStore.displayName                         // 표시 이름 (이메일 기반)
userStore.currentUser.email                   // 고유 식별자로 이메일 사용
```

### 3. 토큰 디코딩 확인
프로젝트에서 JWT 토큰의 구조를 확인하고, 필요시 디코딩 로직을 조정하세요:

```javascript
// 토큰 payload 예시
{
  "email": "user@example.com",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg",
  "exp": 1640995200,
  "iat": 1640908800
}
```

## ⚠️ 주의사항

1. **userId/nickname 제거**: 기존에 userId나 nickname을 사용하던 코드는 email이나 displayName으로 변경해야 합니다.

2. **토큰 구조**: JWT 토큰에 email, role, avatar 정보가 포함되어 있어야 합니다.

3. **권한 체크**: 기존 권한 체크 로직은 그대로 사용 가능합니다.

## 🧪 테스트

```javascript
// 테스트 시나리오
const userStore = useUserStore()

// 1. 로그인 테스트
await userStore.login({
  tokenData: { email: 'test@example.com', role: 'user', avatar: null },
  token: 'test-token'
})

console.log(userStore.isLoggedIn)    // true
console.log(userStore.displayName)   // 'test'
console.log(userStore.isUser)        // true

// 2. 토큰 복원 테스트
localStorage.setItem('accessToken', 'valid-jwt-token')
await userStore.restoreUser()

// 3. 로그아웃 테스트
await userStore.logout()
console.log(userStore.isLoggedIn)    // false
```

## 🎉 마이그레이션 완료!

이제 더 간단하고 토큰 중심의 사용자 관리 시스템을 사용할 수 있습니다. JWT 토큰에서 필요한 정보를 자동으로 추출하여 관리하므로 더 안전하고 효율적입니다.
