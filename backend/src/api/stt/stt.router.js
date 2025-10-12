const controller = require('./stt.controller');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// API 오디오 포멧이 .wav만 지원함.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + '.wav');
    }
});
const upload = multer({ storage: storage });
/**
 * @swagger
 * /api/stt:
 *   post:
 *     summary: 음성을 텍스트로 변환 (Speech-to-Text)
 *     description: WAV 포맷의 오디오 파일을 업로드하여 텍스트로 변환합니다
 *     tags: [STT]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - audio
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: WAV 포맷의 오디오 파일
 *     responses:
 *       200:
 *         description: 변환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: 변환된 텍스트
 *                   example: "안녕하세요"
 *       400:
 *         description: 잘못된 요청 (파일 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "오디오 파일이 필요합니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "STT 처리 중 오류가 발생했습니다."
 */
router.post('/', upload.single('audio'), controller.speechToText);

module.exports = router;