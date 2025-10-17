1. 백엔드 (Backend) 변경 사항

퀴즈 출제 및 채점, Firebase DB 기록을 위한 새로운 API (/api/quiz)를 만들었고, 불안정했던 번역 로직을 대폭 개선했습니다.

backend/src/api/quiz/ 폴더를 새로 만들고 그 안에 아래 3개 파일을 추가했습니다.(quiz.router.js, quiz.controller.js, quiz.service.js)

quiz.router.js: 퀴즈 API의 경로(GET /new, POST /check)를 설정합니다.

quiz.controller.js: 프론트엔드의 요청을 받아서 실제 로직을 처리하는 service 파일로 작업을 넘겨줍니다.

quiz.service.js: 미리 정의된 문제 목록에서 랜덤으로 문제를 선택, 사용자가 제출한 답을 확인하고 채점합니다. 채점 결과를 Firebase DB의 quiz_records 컬렉션에 문제, 정답, 사용자 답과 함께 기록합니다. 

수정한 부분

backend/src/app.js: 새로 만든 quiz.router.js를 서버에 등록하여, 실제로 /api/quiz 주소를 사용할 수 있도록 연결했습니다.

backend/serviceAccountKey.json: Firebase DB에 접속하기 위한 키 파일을 추가했습니다. (이 파일은 추가로 공유해두리겠습니다.)

firebase-admin 라이브러리: npm install firebase-admin 명령어로 설치했습니다.