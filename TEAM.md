1. 백엔드 (Backend) 변경 사항

퀴즈 출제 및 채점, Firebase DB 기록을 위한 새로운 API (/api/quiz)를 만들었고, 불안정했던 번역 로직을 대폭 개선했습니다.

1-1.

backend/src/api/quiz/ 폴더를 새로 만들고 그 안에 아래 3개 파일을 추가했습니다.(quiz.router.js, quiz.controller.js, quiz.service.js)

quiz.router.js: 퀴즈 API의 경로(GET /new, POST /check)를 설정합니다.

quiz.controller.js: 프론트엔드의 요청을 받아서 실제 로직을 처리하는 service 파일로 작업을 넘겨줍니다.

quiz.service.js: 미리 정의된 문제 목록에서 랜덤으로 문제를 선택, 사용자가 제출한 답을 확인하고 채점합니다. 채점 결과를 Firebase DB의 quiz_records 컬렉션에 문제, 정답, 사용자 답과 함께 기록합니다. 

1-2.

수정한 부분

backend/src/app.js: 새로 만든 quiz.router.js를 서버에 등록하여, 실제로 /api/quiz 주소를 사용할 수 있도록 연결했습니다.

backend/serviceAccountKey.json: Firebase DB에 접속하기 위한 키 파일을 추가했습니다. (이 파일은 추가로 공유해두리겠습니다.)

firebase-admin 라이브러리: npm install firebase-admin 명령어로 설치했습니다.

2. 프론트엔드 (Frontend) 변경 사항
 
frontend/src/components/DialectTranslator.jsx 수정

2-1

상태(State) 변수 추가: isQuizMode, currentQuestion, userAnswer, quizResult를 관리하도록 4개의 변수를 추가했습니다.

isQuizMode: useState를 사용해 퀴즈 모드 여부
currentQuestion: 현재 문제
userAnswer: 사용자 답
quizResult: 채점 결과

2-2

기능 함수 추가: 백엔드와 통신하며 퀴즈를 진행하는 handleGetQuiz, handleCheckAnswer, handleReturnToTranslate 함수를 새로 만들었습니다.

2-3

UI (JSX) 대폭 수정: isQuizMode 상태에 따라 화면이 동적으로 바뀌도록 조건부 렌더링을 적용했습니다.

헤더에 '✍️ 사투리 퀴즈 풀기' / '번역기로 돌아가기' 버튼을 추가했습니다.

퀴즈 모드에서는 왼쪽 창이 '문제 표시창', 오른쪽 창이 **'정답 입력창'**으로 역할이 바뀝니다.

가운데 화살표(→) 버튼은 '정답 확인' 기능으로, 초기화 버튼은 '답안 지우기' 기능으로 변경됩니다.

퀴즈와 관련 없는 음성 입력(🎤), 음성 듣기(🔊), 방향 전환(🔄) 버튼은 퀴즈 모드에서 보이지 않도록 깔끔하게 처리했습니다.

화면 하단에 퀴즈 채점 결과(정답/오답 메시지)를 보여주는 새로운 UI 영역을 추가했습니다.

3. 추가 개선

말씀하신 대로 quiz 폴더에 있는 파일들 전부 폴더별로 재배치(controller, routes, service)

파이어 베이스 키는 quiz.service.js 파일 2번째 코드에 입력하시면 됩니다.(따로 공유하겠습니다.) 키파일은 백엔드 폴더에 넣어두면 될 것 같습니다.

이후로도 기능 추가하게 된다면 다시 올려드리겠습니다.