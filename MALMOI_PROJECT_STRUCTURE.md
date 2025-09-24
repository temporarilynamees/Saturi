# MALMOI - 사투리 번역 AI 프로젝트 구조

## 프로젝트 개요
- **프로젝트명**: 말모이 (MALMOI) - Korean Dialect Translation AI
- **개발 기간**: 4주
- **팀 구성**: 5명
- **주요 목표**: 사투리를 표준어로 번역하는 웹 기반 AI 시스템

## 전체 프로젝트 구조

```
malmoi/
├── package.json
├── README.md
├── .gitignore
│
├── backend/                      # Node.js 메인 서버
│   ├── package.json
│   ├── server.js                # 서버 시작점
│   ├── routes/
│   │   ├── translate.js         # 번역 API
│   │   └── tts.js               # TTS API (선택사항)
│   ├── services/
│   │   ├── translationService.js
│   │   └── ttsService.js
│   └── models/
│       └── Translation.js       # 간단한 데이터 저장
│
├── frontend/                     # React 웹 앱
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TranslationBox.js    # 입력/출력 영역
│   │   │   ├── RegionSelector.js    # 지역 선택
│   │   │   └── AudioPlayer.js       # 음성 재생
│   │   ├── App.js
│   │   └── index.js
│   └── build/
│
├── model/                        # AI 모델 (Python)
│   ├── requirements.txt
│   ├── data/
│   │   ├── dialect_data.json    # 사투리 데이터셋
│   │   └── corpus/              # 말뭉치 데이터
│   ├── train_model.py           # 모델 학습
│   ├── predict.py               # 번역 실행
│   └── saved_models/            # 학습된 모델
│
└── tts/                          # TTS 기능 (선택사항)
    ├── package.json
    ├── tts_server.js            # 간단한 TTS 서버
    └── audio/                   # 생성된 음성 파일
```

## 기술 스택

### Backend (Node.js)
- **프레임워크**: Express.js
- **데이터베이스**: Firebase, Mysql

### Frontend (React.js)
- **프레임워크**: React 18
- **스타일링**: CSS3 + 기본 스타일링
- **HTTP 클라이언트**: Axios 또는 Fetch API

### AI Model (Python)
- **머신러닝**: PyTorch 또는 scikit-learn
- **모델 타입**: DNN, Random Forest, XGBoost 중 선택
- **데이터 처리**: pandas, numpy

### TTS (선택사항)
- **외부 API**: Google TTS, Naver Clova Voice 중 선택

## 4주 개발 계획

### 1주차: 기반 구조 및 데이터 준비
- [ ] 프로젝트 환경 설정 (Git, Node.js, Python 환경)
- [ ] 사투리 데이터 수집 및 정리
  - 경상도 사투리 데이터
  - 전라도 사투리 데이터
  - 제주도 사투리 데이터
- [ ] 기본 프로젝트 구조 생성
- [ ] 데이터 전처리 스크립트 작성

### 2주차: 핵심 기능 개발
- [ ] AI 번역 모델 개발 및 학습
- [ ] Node.js 백엔드 API 구현
- [ ] React 프론트엔드 기본 구조
- [ ] 번역 API 연동

### 3주차: 통합 및 기능 완성
- [ ] 프론트엔드-백엔드 통합
- [ ] TTS 기능 추가 (선택사항)
- [ ] 사용자 인터페이스 개선
- [ ] 모델 성능 최적화

### 4주차: 테스트 및 마무리
- [ ] 전체 시스템 테스트
- [ ] 버그 수정 및 성능 개선
- [ ] 문서 작성 및 발표 준비
- [ ] 최종 데모 완성


## 핵심 기능
### 필수 기능 (1차 목표)
- [] **텍스트 번역**: 사투리 텍스트 → 표준어 텍스트
- [] **지역 선택**: 다양한 지역의 사투리 지원
- [] **음성 출력**: 번역된 텍스트를 음성으로 변환 (선택사항)
- [] **웹 인터페이스**: 사용자 친화적인 입력/출력 화면

### 선택 기능 (2차 목표)
- [ ] **TTS 음성 출력**: 번역된 텍스트를 음성으로 변환
- [ ] **번역 기록**: 사용자별 번역 히스토리
- [ ] **모바일 지원**: 반응형 웹 디자인

## 데이터 소스
- **경상도 사투리**: https://cronquist0.tistory.com/8751531
- **제주어 사전**: https://www.jeju.go.kr/culture/dialect/dictionary.htm
- **전라도 사투리**: https://m.cafe.daum.net/obh2004/2le1/106

## 협업 도구
- **버전 관리**: Git/GitHub
- **프로젝트 관리**: Notion
- **모델 관리**: Wandb.ai
- **문서 협업**: Google Docs
- **소통**: Discord, KakaoTalk

## 성공 기준
- **기술적 목표**: 사투리-표준어 번역 정확도 70% 이상
- **사용성 목표**: 직관적인 웹 인터페이스 제공
- **완성도**: 4주 내 데모 가능한 웹 애플리케이션 완성

## 예상 위험 요소
- **데이터 품질**: 사투리 데이터의 일관성 부족
- **모델 성능**: 제한된 시간 내 만족할 만한 번역 품질 달성
- **통합 복잡성**: 다양한 기술 스택 간 연동 문제

## 마일스톤

### Week 1~2 완료 기준
- [ ] 개발 환경 구축 완료
- [ ] 사투리 데이터셋 수집 완료 (최소 1,0000개 문장)
- [ ] 기본 프로젝트 구조 생성

### Week 2~3 완료 기준
- [ ] 기본 번역 모델 학습 완료
- [ ] 백엔드 API 기본 기능 구현
- [ ] 프론트엔드 기본 화면 구현

### Week 3~4 완료 기준
- [ ] 전체 시스템 통합 완료
- [ ] 웹에서 번역 기능 정상 동작
- [ ] TTS 기능 구현 (선택사항)

### Week 완료 기준
- [ ] 최종 테스트 및 버그 수정
- [ ] 프레젠테이션 자료 준비
- [ ] 데모 시연 준비 완료