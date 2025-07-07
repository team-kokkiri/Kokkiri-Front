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

<details>
  <summary>토글</summary>
  <!-- 내용 -->
</details>
