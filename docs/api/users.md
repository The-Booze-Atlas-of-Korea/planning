
# User API

- Base URL: `/users`
    
- 인증 방식: 세션 쿠키 (예: `JSESSIONID`)
    
    - `/auth/login` 성공 후 발급된 세션 쿠키를 함께 보내야 접근 가능한 API들임
        

---

## 1. 내 정보 조회

### 1.1 Endpoint

- **Method**: `GET`
    
- **URL**: `/users/me`
    
- **설명**: 현재 로그인한 사용자의 프로필 정보를 조회한다.
    

### 1.2 요청

- **Headers**
    
    - `Cookie: JSESSIONID=<세션ID>`
        
- **Query / Body**
    
    - 없음
        

### 1.3 응답

#### 성공

- **HTTP Status**: `200 OK`
    
- **Body (JSON)**
    

```json
{
  "id": 1,
  "loginId": "user1234",
  "name": "홍길동",
  "email": "user@example.com",
  "phone": "010-1234-5678",
  "address": "서울특별시 어딘가 123",
  "birthday": "1995-06-01T00:00:00.000+09:00",
  "gender": "M",
  "profileImageUrl": "https://example.com/profile.jpg",
  "authProvider": "LOCAL",
  "providerId": null,
  "status": "ACTIVE",
  "visitVisibilitySetting": "PUBLIC",
  "createdAt": "2025-01-01T10:00:00.000+09:00",
  "updatedAt": "2025-01-10T12:00:00.000+09:00",
  "deletedAt": null,
  "lastLoginAt": "2025-01-20T09:00:00.000+09:00"
}
```

|필드명|타입|설명|
|---|---|---|
|id|number|사용자 고유 ID|
|loginId|string|로그인에 사용하는 ID|
|name|string|이름|
|email|string|이메일|
|phone|string|휴대폰 번호|
|address|string|주소|
|birthday|string|생년월일 (ISO-8601 Datetime 문자열)|
|gender|string|성별 (`M`, `F`, `OTHER`, `UNKNOWN`)|
|profileImageUrl|string\|null|프로필 이미지 URL|
|authProvider|string|인증 제공자 (예: `LOCAL`, `KAKAO`, `GOOGLE` 등)|
|providerId|string\|null|소셜 로그인 계정의 Provider 측 ID|
|status|string|계정 상태 (예: `ACTIVE`, `INACTIVE` 등, 시스템 정의)|
|visitVisibilitySetting|string|프로필/방문기록 공개 범위 (예: `PUBLIC`, `PRIVATE` 등)|
|createdAt|string|계정 생성 시각 (ISO-8601 Datetime)|
|updatedAt|string|마지막 수정 시각|
|deletedAt|string\|null|삭제/탈퇴 시각 (soft delete 시 사용)|
|lastLoginAt|string\|null|마지막 로그인 시각|

#### 오류 (예시)

|HTTP Status|설명|
|---|---|
|`401 Unauthorized`|로그인하지 않았거나 세션이 유효하지 않음|

---

## 2. 내 프로필 수정

### 2.1 Endpoint

- **Method**: `PATCH`
    
- **URL**: `/users/me`
    
- **설명**: 현재 로그인한 사용자의 프로필 정보를 수정한다.
    

### 2.2 요청

- **Headers**
    
    - `Content-Type: application/json`
        
    - `Cookie: JSESSIONID=<세션ID>`
        
- **Body (JSON)**
    

```json
{
  "name": "홍길동",
  "email": "new-email@example.com",
  "phone": "010-9999-8888",
  "address": "서울특별시 새로운 주소 456",
  "birthday": "1995-06-01",
  "gender": "M",
  "profileImageUrl": "https://example.com/new_profile.jpg"
}
```

#### 필드 정의

|필드명|타입|필수|제약 조건 (요약)|
|---|---|---|---|
|name|string|Y|공백 불가|
|email|string|Y|공백 불가, 이메일 형식|
|phone|string|Y|공백 불가, `^01[016789]-?\\d{3,4}-?\\d{4}$` (예: `010-1234-5678`, `01012345678`)|
|address|string|Y|공백 불가|
|birthday|string|Y|과거 날짜여야 함 (예: `1995-06-01`)|
|gender|string|Y|`M`, `F`, `OTHER`, `UNKNOWN` 중 하나|
|profileImageUrl|string|N|제약 없음 (null 가능)|

### 2.3 응답

#### 성공

- **HTTP Status**: `200 OK`
    
- **Body**: 서버 정책에 따라 다름 (예: 수정 성공 여부, 수정된 유저 ID 등)
    

예시 1 — 단순 성공 플래그:

```json
true
```

예시 2 — 수정된 유저 ID 반환:

```json
{
  "userId": 1
}
```

> 실제 반환 포맷은 서버에서 정의한 응답 스펙에 따름.

#### 오류 (예시)

|HTTP Status|설명|
|---|---|
|`400 Bad Request`|요청 필드 형식/값 오류 (검증 실패)|
|`401 Unauthorized`|로그인되지 않은 상태|
|`404 Not Found`|사용자를 찾을 수 없는 경우|
|`409 Conflict`|이메일/전화번호 등 중복으로 인한 충돌 (정책에 따라)|

---

## 3. 내 계정 삭제 (탈퇴)

### 3.1 Endpoint

- **Method**: `DELETE`
    
- **URL**: `/users/me`
    
- **설명**: 현재 로그인한 계정을 삭제(또는 비활성화)한다.  
    실제로는 soft delete(상태 변경 + 삭제 시각 기록)일 수 있음.
    

### 3.2 요청

- **Headers**
    
    - `Cookie: JSESSIONID=<세션ID>`
        
- **Body**
    
    - 없음
        

### 3.3 응답

#### 성공

- **HTTP Status**: `200 OK`
    
- **Body**: 서버 정책에 따라 다름
    

예시 1 — 단순 성공 플래그:

```json
true
```

예시 2 — 삭제된 유저 ID:

```json
{
  "userId": 1
}
```

#### 오류 (예시)

|HTTP Status|설명|
|---|---|
|`401 Unauthorized`|로그인되지 않은 상태|
|`404 Not Found`|사용자를 찾을 수 없는 경우|
|기타|서버 정책에 따른 코드|

---

## 4. 특정 사용자 프로필 조회

### 4.1 Endpoint

- **Method**: `GET`
    
- **URL**: `/users/user/{userid}`
    
- **설명**: 주어진 `userid` 에 해당하는 사용자의 공개 프로필을 조회한다.  
    (프로필 공개 범위 설정에 따라 일부 정보는 노출되지 않을 수 있음)
    

### 4.2 요청

- **Path Parameter**
    

|이름|타입|필수|설명|
|---|---|---|---|
|userid|number|Y|조회할 사용자 ID|

- **Headers**
    
    - 인증 필요 여부는 정책에 따라 다름
        
        - 예: 완전 공개라면 비로그인도 조회 가능
            
        - 비공개/일부 공개라면 로그인 필요
            
- **Body**
    
    - 없음
        

### 4.3 응답

#### 성공

- **HTTP Status**: `200 OK`
    
- **Body**: `GetUserResponse` (내 정보 조회와 동일 구조)
    

```json
{
  "id": 2,
  "loginId": "otheruser",
  "name": "아무개",
  "email": "other@example.com",
  "phone": "010-1111-2222",
  "address": "부산광역시 어딘가",
  "birthday": "1993-03-03T00:00:00.000+09:00",
  "gender": "F",
  "profileImageUrl": "https://example.com/profile2.jpg",
  "authProvider": "LOCAL",
  "providerId": null,
  "status": "ACTIVE",
  "visitVisibilitySetting": "PUBLIC",
  "createdAt": "2025-01-02T10:00:00.000+09:00",
  "updatedAt": "2025-01-10T13:00:00.000+09:00",
  "deletedAt": null,
  "lastLoginAt": "2025-01-21T09:00:00.000+09:00"
}
```

실제로는 공개 범위 설정에 따라  
특정 필드(email, phone 등)가 마스킹되거나 null 로 내려갈 수 있음.

#### 오류 (예시)

|HTTP Status|설명|
|---|---|
|`404 Not Found`|해당 `userid` 사용자가 없거나, 비공개라 접근할 수 없는 경우|
|`403 Forbidden`|로그인은 했지만 권한이 부족한 경우|
|기타|서버 정책 및 내부 에러에 따른 코드|
