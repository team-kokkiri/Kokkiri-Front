<img src="https://github.com/user-attachments/assets/e56ff804-0e04-40f7-9a2a-41e16dbe9193" alt="배너" width="100%"/>

<br/>
<br/>

# 0. Getting Started (시작하기)
```bash
$ npm start
```
[발표자료](https://www.miricanvas.com/v/14tyw7c)<br/>
[프론트엔드 페이지](https://github.com/team-kokkiri/Kokkiri-Front)<br/>
[백엔드 페이지](https://github.com/team-kokkiri/Kokkiri-Back)<br/>


<br/>
<br/>

# 1. Project Overview (프로젝트 개요)
- 프로젝트 이름: KOKKIRI 프로젝트
- 프로젝트 설명: KOKKIRI는 KOSA (한국소프트웨어산업협회) 수강생들을 위한 전용 커뮤니티 플랫폼입니다. 

## 🛠️ 기술 스택

---

### 🟩 Back-end

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java%2017-007396?style=for-the-badge&logo=java&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jwt&logoColor=white)
![OAuth2](https://img.shields.io/badge/OAuth2-0066FF?style=for-the-badge&logo=oauth&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-333333?style=for-the-badge)
![STOMP](https://img.shields.io/badge/STOMP-4FC08D?style=for-the-badge)
![Spring WebFlux](https://img.shields.io/badge/Spring%20WebFlux-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![SSE](https://img.shields.io/badge/SSE-6DB33F?style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Judge0](https://img.shields.io/badge/Judge0-F06F00?style=for-the-badge)
![Lombok](https://img.shields.io/badge/Lombok-FFA518?style=for-the-badge&logo=lombok&logoColor=white)
![H2](https://img.shields.io/badge/H2%20Database-4479A1?style=for-the-badge&logo=h2&logoColor=white)

---

### 🟦 Front-end

![Vue.js](https://img.shields.io/badge/Vue.js%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-F8DC3E?style=for-the-badge&logo=pinia&logoColor=black)
![Vue Router](https://img.shields.io/badge/Vue%20Router-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)
![StompJS](https://img.shields.io/badge/StompJS-4FC08D?style=for-the-badge)
![SockJS](https://img.shields.io/badge/SockJS-990000?style=for-the-badge)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)


<br/>
<br/>

# 2. Team Members (팀원 및 팀 소개)
| 김지은 | 박 준 | 이 휘 | 이동규 |
|:------:|:------:|:------:|:------:|
| <img src="https://github.com/user-attachments/assets/1e7f2b8a-7845-493c-829a-8acf88a67850" alt="김지은" width="150"> | <img src="https://github.com/user-attachments/assets/79082892-4557-4d88-9acf-d82c9b3e95f4" alt="박준" width="150"> | <img src="https://github.com/user-attachments/assets/7cfb7364-567f-4de4-88d1-d53bbeccb0ca" alt="이휘" width="150"> | <img src="https://github.com/user-attachments/assets/2905387f-e0bf-423a-8af0-d92626d8c556" alt="이동규" width="150"> |
| PL | BE | BE | FE |
| [GitHub](https://github.com/keemzleun) | [GitHub](https://github.com/myjuniverse) | [GitHub](https://github.com/0630hwi) | [GitHub](https://github.com/Gorani77) |

<br/>
<br/>

# 3. Key Features (주요 기능)
<img src="https://github.com/user-attachments/assets/dd164870-d83e-4093-b56f-aff062ebdd48" alt="메뉴트리" width="100%"/>

<br/>

- **사용자 관리**:
    - 자체 회원가입 및 로그인 기능
    - JWT를 이용한 인증/인가 처리
    - OAuth2 소셜 로그인 (Google, Kakao)
    - 프로필 정보 수정 (닉네임, 프로필 이미지 변경)
    - 비밀번호 변경 및 찾기 기능
      
- **게시판 및 댓글**:
    - 다양한 종류의 게시판 (자유, 자료공유, 공지사항, 프로젝트 소개, HOT(좋아요 10개 이상))
    - 게시글 및 대댓글 CRUD 기능
    - 게시글 및 댓글 좋아요 기능
    - 파일 첨부 기능
      
- **실시간 채팅 및 알림**:
    - WebSocket과 STOMP를 이용한 실시간 그룹/개인 채팅
    - 채팅방 생성, 참여, 나가기 및 멤버 초대
    - SSE(Server-Sent Events)를 이용한 실시간 알림 (댓글, 좋아요, 채팅 초대 등)

- **코딩 문제 및 랭킹**:
    - 매일 새로운 코딩 문제 제공 (스케줄링)
    - Judge0 API 연동을 통한 코드 컴파일 및 채점
    - 제출 내역 관리 및 결과 확인
    - 일일 랭킹 시스템 (빠른 풀이 순)
 
- **캘린더**:
    - 개인 일정 및 팀 공용 일정 관리
   
- **관리자 기능**:
    - 관리자 대시보드 (사용자, 게시글 현황 통계)
    - 회원 관리 (권한 변경, 계정 활성화/비활성화)
    - 신고 관리
<br/>

# 4. ERD
<img src="https://github.com/user-attachments/assets/aafe99fd-deb7-4ca1-9682-f39fb0650f7e" alt="ERD" width="100%"/>

<br/>

# 5. 서비스 아키텍처
<img src="https://github.com/user-attachments/assets/a2a28ce7-cf4e-4d25-94b0-587b278b7fff" alt="ERD" width="100%"/>

<br/>

# 6. 주요 기능 다이어그램
- 회원가입&이메일인증
<img src="https://github.com/user-attachments/assets/9b498be9-0e8a-4f0e-bc52-013535aa22af" alt="회원가입" width="100%"/>

<br/>

- Ouath2 + 팀코드
<img src="https://github.com/user-attachments/assets/d79192ec-dfed-42a0-82f7-1c7e0a0666e7" alt="오어스" width="100%"/>

<br/>

- 게시판 구조
<img src="https://github.com/user-attachments/assets/6e64d8f4-2b26-4a03-a88a-ab23c3645e9e" alt="게시판" width="100%"/>

<br/>

- 파일 저장 로직
<img src="https://github.com/user-attachments/assets/42ddff03-bba3-45ba-bc13-3fc0238b42d1" alt="파일" width="100%"/>

<br/>

- 문제 채점 로직
<img src="https://github.com/user-attachments/assets/f37f2436-ff49-4994-bcee-2b2e8f4fef80" alt="문제" width="100%"/>

<br/>

# 7. API 명세서
<a href="https://documenter.getpostman.com/view/45626435/2sB2xChp5W" target="_blank">
  <img src="https://github.com/user-attachments/assets/4b332e6d-cb12-44d5-bfbf-0cb17af6f242" alt="Postman" width="120"/>
</a>

[API 명세서 바로가기](https://documenter.getpostman.com/view/45626435/2sB2xChp5W)


<br/>

# 8. GIF 리스트
<details>
  <summary>디자인</summary>
  <br/>

  - **샘플**
    <img width="3194" height="1174" alt="디자인샘플" src="https://github.com/user-attachments/assets/47d791b5-f33d-4cc0-98e7-e9ac01fb6958" />

  - **GIF**
    <img src="https://github.com/user-attachments/assets/67ddf25c-f091-4e17-ae55-40693af8e8f7" alt="디자인 gif" />

</details>

<details>
  <summary>퍼블리싱</summary>
  <br/>

  - **샘플**
    <img src="https://github.com/user-attachments/assets/53de2925-1a9f-4be7-8fbf-e66c67827792" alt="와이어프레임 샘플" />

  - **GIF**
    <img src="https://github.com/user-attachments/assets/4b390347-28bd-4ce3-8973-329db183a29d" alt="와이어프레임 gif" />

</details>


<details>
  <summary>관리자 페이지 / 일일 코딩 문제 / 순위 </summary>
  <br/>

  - **대시보드**
    <br/>
    <img width="1808" height="1349" alt="대시보드" src="https://github.com/user-attachments/assets/2ffdc0d9-1edc-41d6-9502-02c683895eb4" />

  - **회원관리**<br/>  
    <img src="https://github.com/user-attachments/assets/2955a507-8e16-43c6-8f65-6b0d6036fbc3" alt="회원관리" />

  - **문제관리**<br/>  
    <img src="https://github.com/user-attachments/assets/93b588d7-7153-47e1-a509-6130d0b44715" alt="문제관리" />

  - **신고관리**<br/>  
    <img src="https://github.com/user-attachments/assets/085eb926-9cee-4717-9f81-a68fc64d94af" alt="신고관리" />

  - **문제풀기 / 순위**<br/>  
    <img src="https://github.com/user-attachments/assets/d345380a-0faa-4c86-ac62-f67182259897" alt="문제풀기" />

</details>


<details>
  <summary>로그인/회원가입</summary>
  <br/>

  - **일반 회원가입**<br/>  
    <img src="https://github.com/user-attachments/assets/86160475-4486-4cac-a45c-d4187f7abb4c" alt="일반 회원가입"/>

  - **Oauth2(구글)**<br/>  
    <img src="https://github.com/user-attachments/assets/64e88552-3227-4e69-94df-1cacae9375d6" alt="구글 로그인"/>

  - **Oauth2(카카오)**<br/>  
    <img src="https://github.com/user-attachments/assets/40478dbd-5d5d-42b4-b667-6fa061df4952" alt="카카오 로그인"/>

  - **비밀번호 찾기**<br/>  
    <img src="https://github.com/user-attachments/assets/0dacbfa4-5555-482a-b67f-fec41d36a1b9" alt="비밀번호 찾기"/>

</details>

<details>
  <summary>마이페이지</summary>
  <br/>

  - **프로필 변경**<br/>  
    <img src="https://github.com/user-attachments/assets/47aad239-12b6-4f58-9d77-d65145785d6e" alt="프로필 변경"/>

  - **닉네임 변경**<br/>  
    <img src="https://github.com/user-attachments/assets/2eae0825-14e6-4d06-8c37-b6918ff5b959" alt="닉네임 변경"/>

  - **비밀번호 변경**<br/>  
    <img src="https://github.com/user-attachments/assets/044a9af5-398c-4e75-bf32-8079c893f1ad" alt="비밀번호 변경"/>

  - **회원탈퇴**<br/>  
    <img src="https://github.com/user-attachments/assets/27fcbb2e-04fa-42fa-9562-85bfc36d7c86" alt="회원탈퇴"/>
</details>

<details>
  <summary>캘린더</summary>
  <br/>

  - **관리자**<br/>  
    <img src="https://github.com/user-attachments/assets/45c2d7f7-80e7-4292-895a-eb4df800a94c" alt="캘린더(관리자)"/>

  - **일반 사용자**<br/>  
    <img src="https://github.com/user-attachments/assets/7526b484-0df0-42be-8d5a-f3aef1fdce99" alt="캘린더(일반사용자)"/>
</details>

