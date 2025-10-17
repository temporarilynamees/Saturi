const express = require('express');
const router = express.Router();
const controller = require('./quiz.controller');

// GET /api/quiz/new : 새로운 문제를 요청하는 경로
router.get('/new', controller.getQuestion);

// POST /api/quiz/check : 정답을 확인하는 경로
router.post('/check', controller.checkUserAnswer);

module.exports = router;