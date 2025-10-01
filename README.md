# 사투리 번역기 (Saturi Translator)

한국어 사투리를 표준어로 번역하는 웹 애플리케이션

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

**3. 프론트엔드 정적 파일 서빙 (옵션):**

방법 A - 별도 서버 (Nginx, Apache 등)로 `frontend/dist/` 서빙

방법 B - Express에서 직접 서빙 (백엔드 수정 필요)

## API 엔드포인트

### 번역 API
```
GET /api/translation?sentence=사투리문장
```

**응답 예시:**
```json
{
  "translation": "표준어번역"
}
```

## 기술 스택

### Backend
- Node.js
- Express.js
- CORS

### Frontend
- React 18
- Vite
- Axios
- CSS3

## 포트 설정

- 백엔드: `3000`
- 프론트엔드 (개발): `5000`

## 트러블슈팅

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

## 개발자

- GitHub: [temporarilynamees/Saturi](https://github.com/temporarilynamees/Saturi)
