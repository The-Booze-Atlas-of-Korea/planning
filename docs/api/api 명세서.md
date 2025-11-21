### 1. 인증 & 사용자 API

|구분|메서드|URL|설명|인증|주요 요청 데이터(요약)|
|---|---|---|---|---|---|
|회원가입|POST|`/auth/signup`|기본 회원가입|없음|이름, 이메일, 비밀번호, 전화번호, 생년월일, 주소, 성별|
|로그인|POST|`/auth/login`|이메일/비번 로그인, 토큰 발급|없음|이메일, 비밀번호|
|비밀번호 재설정 요청|POST|`/auth/password-reset/request`|비밀번호 초기화 링크/코드 요청|없음|이메일 (또는 휴대폰)|
|비밀번호 재설정 확정|POST|`/auth/password-reset/confirm`|새 비밀번호로 변경|없음|토큰/코드, 새 비밀번호|
|내 프로필 조회|GET|`/users/me`|내 프로필 정보 조회|필요|-|
|내 프로필 수정|PATCH|`/users/me`|이름/전화번호/주소 등 수정|필요|수정할 필드(이름, 폰번호, 주소, 프로필 이미지 등)|
|회원 탈퇴|DELETE|`/users/me`|계정 삭제/비활성화|필요|-|
|사용자 상세 조회|GET|`/users/{userId}`|특정 사용자 공개 프로필 조회|필요|경로변수 `userId`|

---

### 2. 친구 관리 API

|구분|메서드|URL|설명|인증|주요 요청 데이터(요약)|
|---|---|---|---|---|---|
|사용자 검색|GET|`/users/search`|닉네임/이메일로 사용자 검색|필요|`q`, `page`, `size`|
|친구 요청 보내기|POST|`/friends/requests`|다른 사용자에게 친구 요청|필요|`targetUserId`, (선택) 메시지|
|받은 친구 요청 목록|GET|`/friends/requests/received`|내가 받은 친구 요청 리스트|필요|`page`, `size`|
|보낸 친구 요청 목록|GET|`/friends/requests/sent`|내가 보낸 친구 요청 리스트|필요|`page`, `size`|
|친구 요청 수락/거절|PATCH|`/friends/requests/{requestId}`|친구 요청 승인/거절|필요|`action` = `ACCEPT` / `REJECT`|
|친구 목록 조회|GET|`/friends`|내 친구 목록 조회|필요|`page`, `size` (선택)|
|친구 메모/별칭 수정|PATCH|`/friends/{friendUserId}`|친구별 메모/별칭 설정|필요|`alias`, `memo`|
|친구 삭제|DELETE|`/friends/{friendUserId}`|친구 관계 삭제|필요|경로변수 `friendUserId`|

---

### 3. 술집 & 지도/위치 API

|구분|메서드|URL|설명|인증|주요 요청 데이터(요약)|
|---|---|---|---|---|---|
|주변 술집 조회|GET|`/bars/nearby`|내 위치 기준 1km(기본) 내 술집 리스트|필요(또는 선택)|`lat`, `lng`, `radius`, `category`, `openNow`|
|술집 검색|GET|`/bars`|키워드+위치 기반 술집 검색|필요(또는 선택)|`q`, `lat`, `lng`, `radius`, `category`, `page`, `size`|
|술집 상세|GET|`/bars/{barId}`|술집 상세 정보|필요(또는 선택)|`barId`|
|술집 상태 조회|GET|`/bars/{barId}/status`|영업 여부, 만석 여부, 예상 대기시간|필요|`barId`|
|길찾기/경로 안내|GET|`/directions`|출발→도착 간 거리/시간/경로|필요|`fromLat`, `fromLng`, `toLat`, `toLng`, `mode(WALK/TRANSIT/DRIVE)`|
|내 위치 조회(선택)|GET|`/location/me`|브라우저/앱 위치 허용 시 현재 좌표|필요|-|

---

### 4. AI 추천 서비스 API

|구분|메서드|URL|설명|인증|주요 요청 데이터(요약)|
|---|---|---|---|---|---|
|술집 추천 받기|POST|`/recommendations/bars`|시간/날씨/예산/제약 포함 술집 추천|필요|위치, 인원수, 1·2·3차 단계, 예산, 이동수단, 막차시간, 블랙리스트, 선호 테마 등|
|추천 이력 조회|GET|`/recommendations/history`|내가 요청했던 추천 이력|필요|`page`, `size`|

---

### 5. 리뷰 & 평가 API

|구분|메서드|URL|설명|인증|주요 요청 데이터(요약)|
|---|---|---|---|---|---|
|리뷰 요약/통계|GET|`/bars/{barId}/reviews/summary`|평균 별점, 개수, 별점 분포 등|필요(또는 선택)|`barId`|
|리뷰 목록 조회|GET|`/bars/{barId}/reviews`|술집별 리뷰 리스트|필요(또는 선택)|`barId`, `sort(LATEST/LIKES)`, `page`, `size`|
|리뷰 상세 조회|GET|`/reviews/{reviewId}`|개별 리뷰 상세|필요(또는 선택)|`reviewId`|
|리뷰 작성|POST|`/bars/{barId}/reviews`|실제 방문 기반 리뷰 작성|필요|`rating`, `text`, `tags`, `images`|
|리뷰 수정|PATCH|`/reviews/{reviewId}`|내가 쓴 리뷰 내용 수정|필요|수정할 필드 (점수, 내용, 태그 등)|
|리뷰 삭제|DELETE|`/reviews/{reviewId}`|리뷰 삭제|필요|`reviewId`|
|내 리뷰 목록|GET|`/users/me/reviews`|내가 작성한 리뷰 모아보기|필요|`page`, `size`|
|리뷰 좋아요|POST|`/reviews/{reviewId}/like`|좋아요/좋아요 취소|필요|`like` = true/false|
|리뷰 신고|POST|`/reviews/{reviewId}/report`|부적절 리뷰 신고|필요|`reasonCode`, `detail`|
|술집 개인 메모 작성/수정|PUT|`/bars/{barId}/memo`|나만 보는 개인 메모 저장|필요|`content`|
|술집 개인 메모 조회|GET|`/bars/{barId}/memo`|내 메모 조회|필요|`barId`|

---

### 6. 방문 이력 & 선호도 API

|구분|메서드|URL|설명|인증|주요 요청 데이터(요약)|
|---|---|---|---|---|---|
|방문 이력 등록|POST|`/visits`|술집 방문 기록 저장|필요|`barId`, `visitedAt`, `peopleCount`, (선택)`planId`|
|내 방문 이력 조회|GET|`/users/me/visits`|기간별 방문 내역 조회|필요|`from`, `to`, `page`, `size`|
|선호도 프로필 조회|GET|`/users/me/preferences`|선호 술 종류/가격대/분위기 등|필요|-|
|활동 요약 조회|GET|`/users/me/activity-summary`|자주 가는 코스, 모임별 추천에 쓸 요약|필요|기간 등(선택)|
|프라이버시 설정|PATCH|`/users/me/settings/privacy`|방문/리뷰 공개 범위 설정|필요|`visitHistoryVisibility`, `reviewVisibility`|

---

### 7. 술자리 플랜 & 일정/캘린더 API

|구분|메서드|URL|설명|인증|주요 요청 데이터(요약)|
|---|---|---|---|---|---|
|플랜 생성|POST|`/plans`|1·2·3차 코스(술집+시간) 작성|필요|`planName`, `description`, `steps[]`, `members[]`|
|플랜 상세 조회|GET|`/plans/{planId}`|플랜 상세 정보|필요|`planId`|
|플랜 수정|PATCH|`/plans/{planId}`|코스/메모 등 수정|필요|수정 필드|
|플랜 삭제|DELETE|`/plans/{planId}`|플랜 삭제|필요|`planId`|
|플랜 목록(정렬)|GET|`/plans`|내/그룹 플랜 목록 (투표순 정렬 등)|필요|`sort`, `page`, `size`|
|플랜 투표|POST|`/plans/{planId}/votes`|플랜 선호 투표|필요|`vote` = true/false|
|일정 등록|POST|`/schedules`|플랜과 연결된 일정/알림 설정|필요|`planId`, `title`, `type`, `startAt`, `endAt`, `reminders[]`|
|일정 이력 조회|GET|`/schedules/history`|과거 술자리 일정 목록|필요|`from`, `to`, `page`, `size`|
|월간 캘린더 데이터|GET|`/calendar/monthly`|월별 일정 목록(아이콘/타입 포함)|필요|`year`, `month`|
|일간 캘린더 데이터|GET|`/calendar/daily`|일별 상세 일정/툴팁용 요약|필요|`date`|
|일정 상세(회고)|GET|`/calendar/events/{scheduleId}`|일정 상세 + 장소/참여자/메모|필요|`scheduleId`|
|공유 캘린더 생성|POST|`/calendar/shared`|친구와 공유하는 캘린더|필요|캘린더 이름, 멤버 리스트 등|
|구글 캘린더 연동|POST|`/calendar/integrations/google`|Google Calendar 연동 토큰 등록|필요|OAuth 관련 토큰/코드|

---

### 8. 그룹 & 채널 & 채팅 API

| 구분           | 메서드    | URL                                | 설명               | 인증    | 주요 요청 데이터(요약)                        |
| ------------ | ------ | ---------------------------------- | ---------------- | ----- | ------------------------------------ |
| 그룹 생성        | POST   | `/groups`                          | 술자리/모임 그룹 생성     | 필요    | `name`, `description`, `iconUrl`     |
| 그룹 상세 조회     | GET    | `/groups/{groupId}`                | 그룹 정보 조회         | 필요    | `groupId`                            |
| 그룹 수정        | PATCH  | `/groups/{groupId}`                | 그룹 이름/설명/아이콘 수정  | 필요    | 수정 필드                                |
| 그룹 삭제        | DELETE | `/groups/{groupId}`                | 그룹 삭제 (관리자)      | 필요    | `groupId`                            |
| 그룹 소유권 이관    | POST   | `/groups/{groupId}/transfer-owner` | 리더 변경            | 필요    | `newOwnerId`                         |
| 그룹 탈퇴        | POST   | `/groups/{groupId}/leave`          | 내가 그룹에서 나가기      | 필요    | `groupId`                            |
| 멤버 강퇴        | POST   | `/groups/{groupId}/kick`           | 특정 멤버 강퇴         | 필요    | `targetUserId`                       |
| 그룹 멤버 목록     | GET    | `/groups/{groupId}/members`        | 그룹 멤버 리스트        | 필요    | `groupId`                            |
| 초대 링크 생성     | POST   | `/groups/{groupId}/invites`        | 초대 URL 생성        | 필요    | `groupId`                            |
| 초대 정보 조회     | GET    | `/invites/{inviteCode}`            | 초대 대상 그룹 정보 미리보기 | 없음/필요 | `inviteCode`                         |
| 초대 수락        | POST   | `/invites/{inviteCode}/accept`     | 초대 수락 후 그룹 참여    | 필요    | `inviteCode`                         |
| 채널 목록 조회     | GET    | `/groups/{groupId}/channels`       | 그룹 내 채널 리스트      | 필요    | `groupId`                            |
| 채널 생성        | POST   | `/groups/{groupId}/channels`       | 텍스트/이벤트 채널 만들기   | 필요    | `name`, `type(TEXT/PLAN/EVENT)`      |
| 플랜 채널 생성     | POST   | `/groups/{groupId}/channels/plan`  | 특정 플랜 전용 채널      | 필요    | `name`, `linkedPlanId`               |
| 채널에 장소 카드 추가 | POST   | `/channels/{channelId}/places`     | 채널에 술집 카드 공유     | 필요    | `barId`, `comment`                   |
| 채널 노트 추가     | POST   | `/channels/{channelId}/notes`      | 채널 공지/메모 텍스트     | 필요    | `content`                            |
| 채팅 메시지 목록    | GET    | `/channels/{channelId}/messages`   | 채팅 로그 조회         | 필요    | `before`, `after`, `page`, `size`    |
| 메시지 보내기      | POST   | `/channels/{channelId}/messages`   | 텍스트/이미지/영상 전송    | 필요    | `content`, `attachments[]`           |
| 메시지 수정       | PATCH  | `/messages/{messageId}`            | 보낸 메시지 수정        | 필요    | 수정할 내용                               |
| 메시지 삭제       | DELETE | `/messages/{messageId}`            | 메시지 삭제           | 필요    | `messageId`                          |
| 투표(폴) 생성     | POST   | `/channels/{channelId}/polls`      | 채팅방 내 투표 만들기     | 필요    | `question`, `options[]`, `expiresAt` |
| 투표 참여        | POST   | `/polls/{pollId}/vote`             | 옵션 선택            | 필요    | `optionIndex`                        |
| 이모지 리액션      | POST   | `/messages/{messageId}/reactions`  | 이모지 반응 추가/삭제     | 필요    | `emoji`, `add` = true/false          |