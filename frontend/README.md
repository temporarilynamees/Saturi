# 사투리 번역기 Frontend

React를 사용한 한국어 사투리 번역 웹 애플리케이션입니다.

## 기능

- 사투리 입력 필드
- 실시간 표준어 번역 결과 표시
- 깔끔하고 직관적인 UI
- 반응형 디자인
- 로딩 상태 표시
- 에러 핸들링
- Debounce로 api 중복호출 방지
## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 3. 프로덕션 빌드
```bash
npm run build
```

## 프로젝트 구조

```
frontend/
├── src/
│   ├── components/
│   │   ├── DialectTranslator.jsx    # 메인 번역 컴포넌트
│   │   └── DialectTranslator.css    # 컴포넌트 스타일
│   ├── App.jsx                       # 루트 컴포넌트
│   ├── App.css                       # 전역 스타일
│   └── main.jsx                      # 엔트리 포인트
├── index.html                        # HTML 템플릿
├── vite.config.js                    # Vite 설정
└── package.json
```

## API 연동

백엔드 API는 `/api/translation` 엔드포인트를 사용합니다.

**요청 예시:**
```
GET /api/translation?sentence=사투리문장
```

**응답 예시:**
```json
{
  "translation": "표준어번역"
}
```

## 사용 기술

- React 18
- Vite (빌드 도구)
- Axios (HTTP 클라이언트)
- CSS3 (스타일링)

## 개발 참고사항

- 백엔드 서버가 `http://localhost:5000`에서 실행 중이어야 합니다
- Vite의 프록시 설정으로 CORS 문제를 해결합니다
- Enter 키로 번역 실행 가능 (Shift+Enter는 줄바꿈)