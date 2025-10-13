const controller = require('../controller/translation.controller');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/translation:
 *   post:
 *     summary: 사투리 번역
 *     description: 사투리를 표준어로 또는 표준어를 사투리로 번역합니다
 *     tags: [Translation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sentence
 *               - direction
 *             properties:
 *               sentence:
 *                 type: string
 *                 description: 번역할 문장
 *                 example: "안뇽하시게?"
 *               direction:
 *                 type: string
 *                 description: 번역 방향
 *                 enum: [dialect-to-standard, standard-to-dialect]
 *                 example: "dialect-to-standard"
 *     responses:
 *       200:
 *         description: 번역 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 translation:
 *                   type: string
 *                   description: 번역된 문장
 *                   example: "이것은 무엇입니까?"
 *       400:
 *         description: 잘못된 요청 (문장 누락 또는 형식 오류)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "문장이 필요합니다."
 *       500:
 *         description: 서버 오류
 */
router.post('/', controller.translateSentence)

module.exports = router;