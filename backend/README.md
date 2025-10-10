# 사투리 번역기 Backend

Node.js와 Express를 사용한 한국어 사투리 번역 API 서버입니다.

## 기능

- 사투리 → 표준어 번역 API
- CORS 지원
- 에러 핸들링
- 환경 변수 관리

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가합니다

### 3. 개발 서버 실행
```bash
npm run dev
```

서버는 `http://localhost:3000`에서 실행됩니다.

### 4. 프로덕션 실행
```bash
npm start
```

## 프로젝트 구조

```
backend/
├── src/
│   ├── api/
│   │   ├── translation/
│   │   │   ├── translation.router.js       # 번역 라우트
│   │   │   ├── translation.controller.js   # 번역 컨트롤러
│   │   │   └── translation.service.js      # 번역 서비스 로직
│   │   └── tts/
│   │       ├── tts.router.js              # TTS 라우트
│   │       ├── tts.controller.js          # TTS 컨트롤러
│   │       └── tts.service.js             # TTS 서비스 로직
│   ├── app.js                             # Express 앱 설정
│   └── server.js                          # 서버 엔트리 포인트
├── public/                                # 정적 파일 (선택사항)
├── .env                                   # 환경 변수
└── package.json
```

## API 엔드포인트

### 1. 번역 API

**엔드포인트:** `POST /api/translation`

**요청 본문:**
```json
{
  "sentence": "사투리 문장"
}
```

**응답 예시:**
```json
{
  "translation": "표준어 번역"
}
```

**에러 응답:**
```json
{
  "message": "문장이 필요합니다."
}
```

### 2. TTS API

**엔드포인트:** `POST /api/tts`

## 사용 기술

- **Node.js** - JavaScript 런타임
- **Express 5** - 웹 프레임워크
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - 환경 변수 관리

## 주요 미들웨어

- `express.json()` - JSON 요청 본문 파싱
- `cors()` - CORS 활성화
- `express.static()` - 정적 파일 서빙

## 에러 처리

모든 컨트롤러에서 발생하는 에러는 Express의 에러 핸들링 미들웨어로 전달됩니다.

```javascript
try {
  // 비즈니스 로직
} catch (error) {
  next(error);
}
```

## 개발 가이드

### MVC 아키텍처
- **Router**: HTTP 요청 라우팅
- **Controller**: 요청/응답 처리 및 유효성 검증
- **Service**: 비즈니스 로직 구현

### 새로운 API 추가하기
1. `src/api/` 에 새 폴더 생성
2. `router.js`, `controller.js`, `service.js` 파일 생성
3. `app.js`에 라우터 등록

```javascript
app.use('/api/your-endpoint', require('./api/your-endpoint/your-endpoint.router'));
```
