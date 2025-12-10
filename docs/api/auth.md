
# Auth API

## 개요

- Base Path: `/auth`
    
- 인증 방식: **세션 기반 로그인**
    
    - 로그인 성공 시 `JSESSIONID` 쿠키 발급
        
    - 이후 요청에서 쿠키를 통해 인증/인가 처리
        
- 요청/응답 포맷
    
    - Request: `application/json`
        
    - Response: `application/json` (일부 API는 body 없음)
        

---

## 1. 로그인 API

### 1.1 엔드포인트

- **URL**: `/auth/login`
    
- **Method**: `POST`
    
- **설명**: `loginId` + `password` 로 로그인.  
    인증 성공 시 `JSESSIONID` 쿠키가 발급되고, 이후 세션 기반으로 인증이 유지된다.
    

### 1.2 Request

#### Body (JSON)

```json
{
  "loginId": "user1234",
  "password": "P@ssw0rd!"
}
```

#### 필드 상세

|필드명|타입|필수|제약 조건|설명|
|---|---|---|---|---|
|loginId|string|Y|- 공백 불가 (`@NotBlank`)- 길이: 4 ~ 20자 (`@Size`)- 정규식: `^[a-z0-9]{4,20}$`|로그인 ID. 영문 소문자 + 숫자만.|
|password|string|Y|- 공백 불가 (`@NotBlank`)- 정규식: `^(?=._[A-Za-z])(?=._\d)(?=._[~!@#$%^&_()_+\-=?{}\[\]|:;"'<>,./]).{8,20}$`|

**비밀번호 규칙(사람 말로)**

- 길이: **8 ~ 20자**
    
- 반드시 모두 포함:
    
    - 영문자(대/소문자 상관 없음)
        
    - 숫자
        
    - 아래 특수문자 중 하나 이상:  
        `~ ! @ # $ % ^ & * ( ) _ + - = ? { } [ ] | : ; " ' < > , . /`
        

### 1.3 Response

#### 1) 성공

- **HTTP Status**: `200 OK`
    
- **헤더**
    
    - `Set-Cookie: JSESSIONID=...; Path=/; HttpOnly; ...`
        
- **Body**: 없음 (empty body)
    

```http
HTTP/1.1 200 OK
Set-Cookie: JSESSIONID=ABCDEF1234567890; Path=/; HttpOnly

(바디 없음)
```

클라이언트는 **상태 코드 200**과 **쿠키(JSESSIONID)** 발급 여부로 성공을 판단하면 됨.

#### 2) 실패 (예시)

실제 에러 포맷/코드는 전역 예외 처리 및 Spring Security 설정에 따라 달라질 수 있음.

일반적으로 예상 가능한 경우:

- `400 Bad Request`
    
    - 요청 바디 검증 실패 (`@Valid` 위반: 형식/길이/패턴 오류 등)
        
- `401 Unauthorized`
    
    - 로그인 ID 또는 비밀번호가 올바르지 않음 (인증 실패)
        
- 기타 설정에 따라 `403 Forbidden`, `500 Internal Server Error` 등
    

---

## 2. 회원가입 API

### 2.1 엔드포인트

- **URL**: `/auth/signup`
    
- **Method**: `POST`
    
- **설명**: 새 유저를 생성한다.  
    비밀번호 암호화는 `UserService.CreateUser` 내부에서 `passwordEncoder`를 사용해 처리하는 것으로 가정.
    

### 2.2 Request

#### Body (JSON)

```json
{
  "loginId": "user1234",
  "password": "P@ssw0rd!",
  "name": "홍길동",
  "email": "user@example.com",
  "phone": "010-1234-5678",
  "address": "서울특별시 어딘가 123",
  "birthday": "1995-06-01",
  "gender": "M"
}
```

#### 필드 상세

| 필드명      | 타입     | 필수  | 제약 조건                                                               | 설명                                        |
| -------- | ------ | --- | ------------------------------------------------------------------- | ----------------------------------------- |
| loginId  | string | Y   | - 공백 불가- 길이: 4 ~ 20자- 정규식: `^[a-z0-9]{4,20}$`                       | 로그인 ID. 영문 소문자 + 숫자만 허용.                  |
| password | string | Y   | - 공백 불가- 정규식: `^(?=._[A-Za-z])(?=._\d)(?=._[~!@#$%^&_()_+\-=?{}\[\] | :;"'<>,./]).{8,20}$`                      |
| name     | string | Y   | - 공백 불가 (`@NotBlank`)                                               | 사용자 이름                                    |
| email    | string | Y   | - 공백 불가- 이메일 형식 (`@Email`)                                          | 이메일 주소                                    |
| phone    | string | Y   | - 공백 불가- 정규식: `^01[016789]-?\\d{3,4}-?\\d{4}$`                      | 휴대전화 번호 (010/011/016/017/018/019, 하이픈 선택) |
| address  | string | Y   | - 공백 불가                                                             | 주소                                        |
| birthday | string | Y   | - `@NotNull`, `@Past` (과거 날짜여야 함)                                   | 생년월일. ISO-8601 날짜 문자열 예: `1995-06-01`     |
| gender   | string | Y   | - 공백 불가- 정규식: `^(M                                                  | F                                         |

#### `Gender` 값 정의

|값|의미|
|---|---|
|`M`|남성|
|`F`|여성|
|`OTHER`|위 둘 이외의 성별|
|`UNKNOWN`|응답하지 않음/모름|

컨트롤러 내부에서는 `UserGender.fromString(request.Gender())` 로  
`UserGender` enum 으로 변환 후 도메인 계층에 전달한다.

### 2.3 Response

서비스에서 반환하는 `Result<Long>` 기준:

```java
var result = _userService.CreateUser(command);

if (result.isFailure()) {
    return new ResponseEntity<>(result.getSingleErrorOrThrow().getStatus());
}

return ResponseEntity.ok()
        .body(new Object() {
            public final Long userId = result.getOrThrow();
        });
```

#### 1) 성공

- **HTTP Status**: `200 OK`
    
- **Body**:
    

```json
{
  "userId": 123
}
```

#### 2) 실패

- `result.isFailure()` 인 경우
    
    - `result.getSingleErrorOrThrow().getStatus()` 값을 HTTP Status 로 그대로 사용
        
    - body는 없는 `ResponseEntity(status)` 형태
        

예상되는 에러 케이스(도메인 설계에 따라 다름):

- `400 Bad Request`
    
    - 입력 값이 도메인 규칙 위반 (예: 비즈니스 검증 실패)
        
- `409 Conflict`
    
    - `loginId` 또는 `email` 중복 등
        
- 기타
    
    - 서버 내부 에러 발생 시 `500 Internal Server Error` 등
        

실제 어떤 HttpStatus 가 매핑되는지는  
`Result` / 에러 객체 구현(`getStatus()`)에 의해 결정됨.

---

## 3. 동작 요약 

- **로그인 (`POST /auth/login`)**
    
    - `loginId`, `password` 검증 → `AuthenticationManager` 로 인증
        
    - 성공 시:
        
        - `SecurityContext` 설정
            
        - `HttpSession`에 `SPRING_SECURITY_CONTEXT_KEY` 로 저장
            
        - `JSESSIONID` 쿠키 발급
            
        - 응답: `200 OK`, body 없음
            
- **회원가입 (`POST /auth/signup`)**
    
    - 요청 바디 검증 (`@Valid`)
        
    - `CreateUserCommand` 빌드 후 `UserService.CreateUser()` 호출
        
    - 성공 시:
        
        - `200 OK`
            
        - body: `{ "userId": <생성된 사용자 ID> }`
            
    - 실패 시:
        
        - `Result` 내부 에러의 HttpStatus 코드로 응답  
            (예: 400, 409 등)
            
