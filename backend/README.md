# 사투리 번역기 Backend

Node.js와 Express를 사용한 한국어 사투리 번역 및 음성 인식 API 서버입니다.

## 기능

- 🔄 **사투리 번역**: 제주 사투리 ↔ 표준어 양방향 번역
- 🎤 **음성 인식 (STT)**: ETRI API를 활용한 한국어 음성-텍스트 변환
- 🎵 **오디오 처리**: WebM → WAV 자동 변환 (FFmpeg)
- 🌐 **CORS 지원**: 프론트엔드 통합
- 📁 **파일 업로드**: Multer 기반 오디오 파일 처리

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가합니다:

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
│   │   │   └── translation.service.js      # 번역 서비스 (제주 사투리 사전)
│   │   ├── stt/
│   │   │   ├── stt.router.js              # STT 라우트
│   │   │   ├── stt.controller.js          # STT 컨트롤러
│   │   │   └── stt.service.js             # ETRI API 연동 & FFmpeg 변환
│   │   └── tts/                           # (예정)
│   ├── uploads/                           # 임시 오디오 파일 저장소
│   ├── app.js                             # Express 앱 설정
│   └── server.js                          # 서버 엔트리 포인트
├── .env                                   # 환경 변수 (git ignore)
├── package.json
└── README.md
```

## API 엔드포인트

### 1. 번역 API

**엔드포인트:** `POST /api/translation`

**요청 본문:**
```json
{
  "sentence": "안뇽하시게 어디가게",
  "direction": "jeju to korean"
}
```

**direction 옵션:**
- `"jeju to korean"`: 제주 사투리 → 표준어 (기본값)
- `"korean to jeju"`: 표준어 → 제주 사투리

**응답 예시:**
```json
{
  "translation": "안녕하세요 어디 가세요"
}
```

**지원 제주 사투리 예시:**
- 인사: `안뇽하시게`, `혼저옵서예`, `안뇽히게시서`
- 일상: `했수깡`, `곱다`, `이녁`, `어멍`, `아방`
- 동사: `가게`, `왔수게`, `먹엉`, `보라게`
- 기타: `오름`, `올레`, `닥세`, `무사`, `지슥`

**에러 응답:**
```json
{
  "message": "문장이 필요합니다."
}
```

### 2. 음성 인식 (STT) API

**엔드포인트:** `POST /api/stt`

**요청 형식:** `multipart/form-data`

**파라미터:**
- `audio`: 오디오 파일 (WAV, WebM 지원)

**cURL 예시:**
```bash
curl -X POST http://localhost:3000/api/stt \
  -F "audio=@recording.wav"
```

**응답 예시 (ETRI API 형식):**
```json
{
  "return_object": {
    "recognized": "안녕하세요"
  }
}
```

**처리 과정:**
1. 오디오 파일 업로드 → `src/uploads/` 임시 저장
2. WebM 형식일 경우 → WAV 자동 변환 (FFmpeg)
3. WAV 파일 → Base64 인코딩
4. ETRI API 호출 (한국어 음성 인식)
5. 결과 반환 후 임시 파일 자동 삭제

**에러 응답:**
```json
{
  "error": "오디오 파일이 필요합니다."
}
```

## 사용 기술

### Backend Framework
- **Node.js** - JavaScript 런타임
- **Express 5** - 웹 프레임워크
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - 환경 변수 관리

### 음성 처리
- **FFmpeg** - 오디오 포맷 변환 (WebM → WAV)
- **fluent-ffmpeg** - FFmpeg Node.js 래퍼
- **@ffmpeg-installer/ffmpeg** - FFmpeg 자동 설치

### 파일 업로드
- **Multer** - multipart/form-data 처리
- 업로드 경로: `src/uploads/`
- 자동 파일명: `audio-{timestamp}-{random}.wav`

### 외부 API
- **ETRI WiseASR** - 한국어 음성 인식
- **Axios** - HTTP 클라이언트

## 주요 미들웨어

- `express.json()` - JSON 요청 본문 파싱
- `cors()` - CORS 활성화 (모든 도메인 허용)
- `express.static()` - 정적 파일 서빙
- `multer()` - 파일 업로드 처리

## 에러 처리

모든 컨트롤러에서 발생하는 에러는 적절한 HTTP 상태 코드와 함께 JSON 형식으로 반환됩니다.

```javascript
try {
  // 비즈니스 로직
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

**일반적인 에러 상황:**
- `400 Bad Request`: 필수 파라미터 누락
- `500 Internal Server Error`: ETRI API 호출 실패, FFmpeg 변환 실패

## 개발 가이드

### MVC 아키텍처
- **Router**: HTTP 요청 라우팅 및 미들웨어 설정
- **Controller**: 요청/응답 처리, 유효성 검증, 에러 핸들링
- **Service**: 비즈니스 로직 구현 (번역, API 호출, 파일 변환)

### 새로운 API 추가하기
1. `src/api/` 에 새 폴더 생성 (예: `tts/`)
2. 다음 파일들 생성:
   - `{name}.router.js` - 라우트 정의
   - `{name}.controller.js` - 요청/응답 처리
   - `{name}.service.js` - 비즈니스 로직
3. [src/app.js](src/app.js)에 라우터 등록:

```javascript
const newApi = require('./api/your-endpoint/your-endpoint.router');
app.use('/api/your-endpoint', newApi);
```

### 번역 사전 추가하기

[src/api/translation/translation.service.js](src/api/translation/translation.service.js)의 `dialectDictionary` 객체에 새 패턴 추가:

```javascript
const dialectDictionary = {
    jeju: {
        patterns: [
            {dialect: "사투리단어", standard: "표준어단어"},
            // 새 패턴 추가
        ]
    },
    // 다른 지역 사투리 추가 가능 (부산, 경상도 등)
}
```

## 트러블슈팅

### FFmpeg 설치 오류
```bash
# FFmpeg 수동 설치 (Linux)
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### ETRI API 에러
- API 키가 올바른지 확인
- 일일 호출 한도 확인 (무료 플랜: 1,000건/일)
- 네트워크 연결 확인

### 파일 업로드 실패
- `src/uploads/` 디렉토리 존재 여부 확인
- 파일 권한 확인 (`chmod 755 src/uploads/`)

### 포트 충돌
```bash
# 포트 사용 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

## 라이선스

ISC

## 개발자

- GitHub: [temporarilynamees/Saturi](https://github.com/temporarilynamees/Saturi)
