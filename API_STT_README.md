# 기능 통합을 위한 브랜치 입니다.
Dev 브랜치에 기능 통합을 진행하고 그 다음 main에 머지를 진행할 예정입니다.  
기능 통합을 수행하는 도중에 발생하는 오류는 issue에 작성해 주세요.
# 🗣️ 사투리 번역기 (Saturi Translator)

한국어 사투리를 표준어로 번역하는 웹 애플리케이션

## ✨ 주요 기능

- 🎤 **음성 입력**: Web Speech API를 이용한 실시간 음성 인식
- 💬 **텍스트 입력**: 직접 사투리 문장 입력
- 🔄 **실시간 번역**: 사투리를 표준어로 자동 변환
- 📱 **반응형 디자인**: 모바일/태블릿/데스크톱 지원

## 프로젝트 구조

```
Saturi/
├── backend/          # Express.js 백엔드 서버
├── frontend/         # React 프론트엔드
└── README.md
```

## 빠른 시작

### 1. 백엔드 실행

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev

# 또는 프로덕션 모드
npm start
```

백엔드 서버: `http://localhost:5000`

### 2. 프론트엔드 실행

```bash
# 프론트엔드 디렉토리로 이동 (새 터미널)
cd frontend

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드 서버: `http://localhost:3000`

### 3. 프론트엔드 프로덕션 빌드

```bash
cd frontend
npm run build
npm run preview
```

빌드된 파일은 `frontend/dist/` 폴더에 생성됩니다.

## 전체 실행 가이드

### 개발 환경 (Development)

**터미널 1 - 백엔드:**
```bash
cd ~/Saturi/backend
npm install
npm run dev
```

**터미널 2 - 프론트엔드:**
```bash
cd ~/Saturi/frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 환경 (Production)

**1. 프론트엔드 빌드:**
```bash
cd frontend
npm install
npm run build
npm run preview
```

**2. 백엔드 실행:**
```bash
cd backend
npm install
npm start
```
## API 엔드포인트

### 번역 API
```
GET /api/translation?sentence=사투리문장
```
....
**응답 예시:**
```json
{
  "translation": "표준어번역"
}
```

## 🛠️ 기술 스택

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### Frontend
- React 18
- Vite
- Axios
- Web Speech API (음성 인식)
- CSS3 (Animations & Responsive)

## 🎤 음성 입력 사용 방법

1. **마이크 버튼 클릭**: 텍스트 입력 영역 오른쪽 하단의 🎤 버튼 클릭
2. **권한 허용**: 브라우저에서 마이크 권한 허용
3. **음성 입력**: 사투리로 말하기 (한국어 자동 인식)
4. **자동 변환**: 말한 내용이 텍스트로 자동 입력됨
5. **번역 실행**: → 버튼을 눌러 표준어로 번역

### 브라우저 호환성
- ✅ Chrome/Edge (권장)
- ✅ Safari (iOS/macOS)
- ⚠️ Firefox (제한적 지원)

### 음성 인식 에러 처리
- "음성이 감지되지 않았습니다" - 다시 시도하거나 더 크게 말해주세요
- "마이크 권한이 필요합니다" - 브라우저 설정에서 마이크 권한 허용
- "음성 인식을 지원하지 않습니다" - Chrome 또는 Edge 브라우저 사용 권장

## 포트 설정

- 백엔드: `3000`
- 프론트엔드 (개발): `5000`

## 🐛 트러블슈팅

### 포트 충돌
```bash
# 포트 사용 확인
lsof -i :3000
lsof -i :5000

# 프로세스 종료
kill -9 <PID>
```

### CORS 에러
- 백엔드에서 CORS가 활성화되어 있는지 확인
- `backend/src/app.js`에 `app.use(cors())` 확인

### API 연결 실패
- 백엔드 서버가 실행 중인지 확인
- `vite.config.js`의 프록시 설정 확인

### 음성 인식이 작동하지 않는 경우
- Chrome 또는 Edge 브라우저 사용 확인
- HTTPS 환경인지 확인 (로컬에서는 localhost 허용)
- 브라우저 마이크 권한 설정 확인
- 시스템 마이크가 정상 작동하는지 확인

## 개발자

- GitHub: [temporarilynamees/Saturi](https://github.com/temporarilynamees/Saturi)
