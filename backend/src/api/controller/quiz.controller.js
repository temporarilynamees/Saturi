const service = require('./quiz.service');

// 새 문제 요청 처리
async function getQuestion(req, res, next) {
    try {
        const question = service.getNewQuestion();
        res.status(200).json(question);
    } catch (error) {
        next(error);
    }
}

// 정답 확인 요청 처리
async function checkUserAnswer(req, res, next) {
    try {
        const { dialectQuestion, userAnswer } = req.body;
        if (!dialectQuestion || !userAnswer) {
            return res.status(400).json({ message: "필요한 정보가 부족합니다." });
        }
        const result = await service.checkAnswer(dialectQuestion, userAnswer);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getQuestion,
    checkUserAnswer
};