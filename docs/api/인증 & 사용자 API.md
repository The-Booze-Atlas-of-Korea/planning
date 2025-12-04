# 인증 & 사용자 API

| 구분        | 메서드    | URL             | 설명                           | 인증  | 주요 요청 데이터(요약)                                                     |
| --------- | ------ | --------------- | ---------------------------- | --- | ----------------------------------------------------------------- |
| 회원가입      | POST   | /auth/signup    | 기본 회원가입 (아이디/이메일/비밀번호 기반)    | 없음  | loginId, email, password, name, phone, birthDate, address, gender |
| 로그인       | POST   | /auth/login     | 아이디(loginId)/비밀번호 로그인, 토큰 발급 | 없음  | loginId, password                                                 |
| 내 프로필 조회  | GET    | /users/me       | 내 프로필 정보 조회                  | 필요  | -                                                                 |
| 내 프로필 수정  | PATCH  | /users/me       | 이름/전화번호/주소 등 수정              | 필요  | 수정할 필드 (name, phone, email, address, profileImageUrl 등)           |
| 회원 탈퇴     | DELETE | /users/me       | 계정 탈퇴 처리 (소프트 삭제 + 개인정보 익명화) | 필요  | -                                                                 |
| 사용자 상세 조회 | GET    | /users/{userId} | 특정 사용자 공개 프로필 조회             | 필요  | 경로 변수 userId                                                      |
