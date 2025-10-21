const admin = require('firebase-admin');
const serviceAccount = require('../../config/serviceAccountKey.json');
// Firebase 앱 초기화 (최초 한 번만 실행)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

// 다른 config 파일로 빼두는 게 낫다.

// 퀴즈 문제 목록 (CSV 대신 여기에 직접 문제를 추가/관리하는 것이 더 안정적입니다)
const quizList = [
    { dialect: "혼저옵서예", standard: "어서 오세요" },
    { dialect: "밥 먹었수깡?", standard: "밥 먹었어요?" },
    { dialect: "어디 강?", standard: "어디 가니?" },
    { dialect: "무사 경?", standard: "왜 그래?" },
    { dialect: "빙떡", standard: "메밀전" },
    { dialect: "오름", standard: "언덕" },
    { dialect: "무슨 일 이수과?", standard: "무슨 일 이예요?" }
];

// 문제 중복 제거 로직 필요, 문제 개수 최소 3배, 문제 자체를 다른 폴더로 옮겨라 

// 랜덤으로 문제를 하나 선택해서 반환하는 함수
function getNewQuestion() {
    if (quizList.length === 0) {
        throw new Error("퀴즈 목록이 비어있습니다.");
    }
    const randomIndex = Math.floor(Math.random() * quizList.length);
    const question = quizList[randomIndex];
    // 문제로는 사투리만 보내줌 (정답은 서버만 알고 있음)
    return { dialect: question.dialect };
}

// 정답을 확인하고, 그 결과를 Firestore에 기록하는 함수
async function checkAnswer(dialectQuestion, userAnswer) {
    const problem = quizList.find(q => q.dialect === dialectQuestion);

    if (!problem) {
        return { correct: false, message: "문제를 찾을 수 없습니다." };
    }
    
    const isCorrect = (problem.standard === userAnswer);
    
    // Firestore 'quiz_records' 컬렉션에 퀴즈 결과 기록
    try {
        const quizRecord = {
            dialect_question: dialectQuestion, // 문제 (사투리)
            standard_answer: problem.standard, // 정답 (표준어)
            user_answer: userAnswer,           // 사용자가 제출한 답
            is_correct: isCorrect,
            created_at: new Date()
        };
        await db.collection('quiz_records').add(quizRecord);
        console.log('퀴즈 결과가 Firestore에 저장되었습니다.');
    } catch (error) {
        console.error('Firestore 저장 중 오류 발생:', error);
    }
    
    // 채점 결과 반환
    if (isCorrect) {
        return { correct: true };
    } else {
        return { correct: false, answer: problem.standard };
    }
}

module.exports = {
    getNewQuestion,
    checkAnswer
};