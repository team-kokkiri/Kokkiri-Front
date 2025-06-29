# 일일 문제 페이지 구현

기존의 PartyPage를 대체하여 일일 문제 풀이 페이지와 순위 페이지를 구현했습니다.

## 📁 구현된 페이지

### 1. 일일 문제 페이지 (`/main-page/daily-problem`)
- 오늘의 문제 표시 및 코드 작성
- 코드 제출 기능
- 순위 페이지로 이동 버튼

### 2. 순위 페이지 (`/main-page/daily-ranking`)
- 오늘의 랭킹 목록 표시
- 랭킹 아이템 클릭 시 코드 드롭다운
- 문제 풀기 페이지로 돌아가기 버튼

## 🗂️ 컴포넌트 구조 (daily-problem 폴더로 정리)

### 페이지 컴포넌트
- `pages/main/DailyProblemPage.vue` - 일일 문제 페이지
- `pages/main/DailyRankingPage.vue` - 순위 페이지

### 일일 문제 컴포넌트 (`components/daily-problem/`)
- `ProblemDescription.vue` - 문제 설명 표시
- `ProblemSection.vue` - 문제의 각 섹션 표시
- `CodeEditor.vue` - 코드 에디터 메인 컨테이너
- `CodeEditorHeader.vue` - 파일명 헤더 (Main.java 고정)
- `CodeInput.vue` - 코드 입력 텍스트 영역
- `ResultHeader.vue` - 실행 결과 헤더
- `ExecutionResult.vue` - 실행 결과 표시
- `RankingItem.vue` - 순위 아이템 (드롭다운 포함)

### 공통 컴포넌트
- `components/common/ActionButton.vue` - 액션 버튼

## 🔧 컴포저블

### 1. `useDailyProblem.js` - 일일 문제 관련 로직
- 문제 데이터 관리
- 코드 제출 기능
- 에러 처리

### 2. `useDailyRanking.js` - 순위 관련 로직
- 랭킹 데이터 관리
- 코드 조회 기능
- 드롭다운 상태 관리
- 시간 포맷팅 유틸리티

## 🌐 API 연동

### 사용 API 엔드포인트:
1. `GET /api/problems/today` - 오늘의 문제 + 랭킹 조회
2. `GET /api/rankings/today` - 오늘 랭킹만 조회
3. `POST /api/submissions` - 코드 제출
4. `GET /api/submissions/code/{submissionId}` - 특정 제출 코드 조회

### 🆕 백엔드 API 개선사항
- **팀 정보 추가**: `memberTeamId`, `memberTeamName` 필드 추가
- **N+1 문제 해결**: JOIN FETCH로 팀 정보를 한 번에 조회

## 🗂️ 라우팅 변경

```javascript
// 기존
'/main-page/party' → PartyPage

// 현재
'/main-page/daily-problem' → DailyProblemPage
'/main-page/daily-ranking' → DailyRankingPage
```

## 🎯 주요 기능

### 일일 문제 페이지
1. **문제 표시**: 제목, 설명, 제한사항, 입출력 예시
2. **코드 에디터**: Main.java 기본 템플릿 제공
3. **코드 제출**: 실시간 채점 및 결과 표시
4. **순위 보기**: 순위 페이지로 이동

### 순위 페이지
1. **랭킹 표시**: 순위, 이름, 반 이름, 해결 시간
2. **코드 조회**: 랭킹 아이템 클릭 시 드롭다운으로 코드 표시
3. **실시간 새로고침**: 랭킹 업데이트
4. **문제 풀기**: 문제 페이지로 돌아가기

## 💡 설계 원칙

### SRP (Single Responsibility Principle)
- 각 컴포넌트는 단일 책임을 가집니다
- 문제 표시, 코드 편집, 결과 표시, 랭킹 표시가 각각 분리

### SSOT (Single Source of Truth)
- 모든 상태는 해당 컴포저블에서 중앙 관리
- 컴포넌트 간 직접적인 상태 공유 금지

### 컴포넌트 재사용성
- daily-problem 폴더로 관련 컴포넌트 그룹화
- 명확한 Props/Emits 인터페이스

## 🎨 사용자 경험

### 직관적인 네비게이션
- 문제 풀기 ↔ 순위 보기 간 쉬운 이동
- 명확한 액션 버튼 배치

### 반응형 피드백
- 로딩 상태 표시
- 에러 메시지 및 재시도 옵션
- 실시간 결과 표시

### 코드 조회 UX
- 드롭다운 방식으로 공간 효율성
- 문법 하이라이팅 (기본 스타일)
- 제출 정보 및 통계 표시

## 🚀 성능 최적화

- **컴포넌트 분리**: 불필요한 리렌더링 방지
- **지연 로딩**: 라우트 기반 코드 스플리팅
- **상태 관리**: 필요한 데이터만 로드
- **캐싱**: 같은 제출 코드 중복 요청 방지

## 📝 주요 변경사항

1. **기존 PartyPage 대체** → DailyProblemPage
2. **컴포넌트 구조 정리** → daily-problem 폴더로 이동
3. **순위 페이지 추가** → 새로운 기능 구현
4. **팀 정보 추가** → 백엔드 API 개선
5. **코드 실행 제거** → 제출 플로우 간소화
