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