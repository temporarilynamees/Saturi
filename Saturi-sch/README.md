# 사투리 자동 번역 – TTS 백엔드 (박민준)

> 제주어 ↔ 표준어 번역 결과를 **음성(MP3)** 으로 합성하는 백엔드 모듈  
> 담당: **박민준** — TTS API 설계/구현, 품질(캐시·로그), 파이프라인 스텁, 브라우저 데모

---

## ✨ 주요 기능
- **TTS 합성 API**: `POST /api/tts` — 텍스트 → MP3 스트리밍
- **언어 스위치**: `lang=ko|jje` (현재 gTTS는 `ko`만 지원, `jje`는 Coqui 예정)
- **스피커 목록 API**: `GET /api/tts/speakers?lang=ko`
- **품질/운영**: 디스크 캐시(`/cache`), 일별 로그(`/logs`), 입력 검증(Joi)
- **파이프라인 스텁**: `POST /api/pipe/translate-tts` (번역→TTS 한 번에)
- **브라우저 데모**: 루트(`/`)에서 바로 합성 테스트

---

## 📁 폴더 구조
backend/
├─ public/ # 브라우저 데모(index.html)
├─ src/
│ ├─ controllers/
│ │ ├─ tts.controller.js
│ │ └─ pipe.controller.js
│ ├─ routes/
│ │ ├─ tts.routes.js
│ │ └─ pipe.routes.js
│ ├─ services/
│ │ ├─ tts/
│ │ │ ├─ providers/
│ │ │ │ ├─ gtts.js # 표준어(ko)용 기본 프로바이더
│ │ │ │ └─ (coqui.js, clova.js 예정)
│ │ │ ├─ index.js # 프로바이더 스위치 + 캐시/로그
│ │ │ └─ normalizer.js # 간단 텍스트 정규화
│ │ └─ translate/
│ │ └─ index.js # 번역 스텁(팀 API 연결 예정)
│ ├─ utils/
│ │ ├─ audio.js
│ │ ├─ fileCache.js # 디스크 캐시 유틸
│ │ └─ logger.js # 일별 로그 기록
│ ├─ app.js
│ └─ server.js
├─ .env
├─ .gitignore
├─ package.json
└─ README.md

---


---

## ⚙️ 설치 & 실행
```bash
# 1) 의존성 설치
cd backend
npm install

# 2) 환경변수 (backend/.env)
PORT=3000
TTS_PROVIDER=gtts

# 3) 실행
npm start
# 서버가 3000번 포트에서 정상적으로 실행되었습니다.


👤 담당(박민준) 역할

TTS 합성 API 설계/구현 및 운영

언어 스위치 구조(ko|jje) 및 프로바이더 확장 포인트 구축

품질/운영 기능: 캐시, 로그, 입력 검증, 데모 페이지

번역→TTS 파이프라인 스텁 제공(팀 번역 API 연결 준비)

🗺️ 로드맵

 제주어 TTS(Coqui) 어댑터 연동

 상용 TTS(Clova/Google) 어댑터 추가

 번역 API 연결로 /api/pipe/translate-tts 완성

 오디오 후처리(레벨 노말라이즈)

 관측/모니터링(지연·캐시율·에러율)