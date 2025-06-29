# 일일 문제 페이지 구현

기존의 PartyPage를 대체하여 일일 문제 풀이 페이지를 구현했습니다.

## 구현된 컴포넌트

### 페이지 컴포넌트
- `DailyProblemPage.vue` - 메인 페이지 컴포넌트

### 기능 컴포넌트
- `ProblemDescription.vue` - 문제 설명 표시
- `ProblemSection.vue` - 문제의 각 섹션 (설명, 제한사항, 입출력 예) 표시
- `CodeEditor.vue` - 코드 에디터 메인 컨테이너
- `CodeEditorHeader.vue` - 파일명 헤더 (Solution.java 고정)
- `CodeInput.vue` - 코드 입력 텍스트 영역
- `ResultHeader.vue` - 실행 결과 헤더
- `ExecutionResult.vue` - 실행 결과 표시
- `ActionButton.vue` - 코드 실행/제출 버튼

### 컴포저블
- `useDailyProblem.js` - 일일 문제 관련 비즈니스 로직

## API 연동

다음 API 엔드포인트를 사용합니다:

1. `GET /api/problems/today` - 오늘의 문제 조회
2. `POST /api/submissions` - 코드 제출
3. `POST /api/problem/compiler/run` - 코드 실행 (개발 및 테스트용)

## 라우팅 변경

- 기존: `/main-page/party` → 새로운: `/main-page/daily-problem`
- 네비게이션 메뉴: "파티찾기" → "일일문제"

## 컴포넌트 설계 원칙

### SRP (Single Responsibility Principle)
- 각 컴포넌트는 단일 책임을 가집니다
- `ProblemDescription`은 문제 표시만 담당
- `CodeEditor`는 코드 편집만 담당
- `ExecutionResult`는 결과 표시만 담당

### SSOT (Single Source of Truth)
- 모든 상태는 `useDailyProblem` 컴포저블에서 중앙 관리
- 부모-자식 간 props/emit으로 데이터 흐름 관리
- 컴포넌트 간 직접적인 상태 공유 금지

## 피그마 디자인 준수

피그마 디자인의 레이아웃과 스타일을 정확히 구현:
- 왼쪽: 문제 설명 영역 (402px 고정폭)
- 오른쪽: 코드 에디터 영역 (나머지 영역)
- 상단: 문제 타이틀 헤더
- 하단: 실행/제출 버튼

## 사용 방법

1. `/main-page/daily-problem` 경로로 접근
2. 자동으로 오늘의 문제 로드
3. 코드 작성 후 "코드 실행" 또는 "제출하기" 버튼 클릭
4. 실행 결과가 하단에 표시됨

## 에러 처리

- API 호출 실패 시 적절한 에러 메시지 표시
- 문제 정보가 없는 경우 처리
- 로딩 상태 표시
- 네트워크 오류 처리
