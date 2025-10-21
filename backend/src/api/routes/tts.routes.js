const { Router } = require('express');
const ctrl = require('../controller/tts.controller');

const router = Router();
/**
 * @swagger
 * /api/tts/speakers:
 *   get:
 *     summary: TTS 화자 목록 조회
 *     description: 지정된 언어에 대한 사용 가능한 TTS 화자 목록을 반환합니다
 *     tags: [TTS]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [ko, jje]
 *           default: ko
 *         description: 언어 코드 (ko=한국어, jje=제주어)
 *     responses:
 *       200:
 *         description: 화자 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 provider:
 *                   type: string
 *                   description: TTS 제공자 이름
 *                 lang:
 *                   type: string
 *                   description: 요청된 언어 코드
 *                 speakers:
 *                   type: array
 *                   description: 화자 목록
 *                   items:
 *                     type: string
 */
router.get('/speakers', ctrl.getSpeakers);

/**
 * @swagger
 * /api/tts:
 *   post:
 *     summary: TTS 음성 합성
 *     description: 텍스트를 음성으로 변환하여 오디오 스트림을 반환합니다
 *     tags: [TTS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: 음성으로 변환할 텍스트
 *                 example: "안녕하세요"
 *               lang:
 *                 type: string
 *                 enum: [ko, jje]
 *                 default: ko
 *                 description: 언어 코드 (ko=한국어, jje=제주어)
 *               speaker:
 *                 type: string
 *                 description: 화자 ID (선택 사항)
 *                 example: "female_kr"
 *               speed:
 *                 type: number
 *                 minimum: 0.8
 *                 maximum: 1.2
 *                 default: 1.0
 *                 description: 음성 속도
 *     responses:
 *       200:
 *         description: TTS 음성 합성 성공
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: audio/mpeg
 *             description: 오디오 MIME 타입
 *           X-Cache:
 *             schema:
 *               type: string
 *               enum: [HIT]
 *             description: 캐시 적중 여부 (있는 경우에만)
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: 잘못된 요청 (유효성 검증 실패)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "text is required"
 *       500:
 *         description: TTS 합성 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "TTS synthesis failed"
 */
router.post('/', ctrl.postTTS);

/**
 * @swagger
 * /api/tts/preview:
 *   post:
 *     summary: TTS 미리듣기
 *     description: 고정된 샘플 텍스트로 TTS 음성을 미리 듣습니다
 *     tags: [TTS]
 *     responses:
 *       200:
 *         description: 미리듣기 오디오 반환 성공
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: audio/mpeg
 *             description: 오디오 MIME 타입
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: TTS 미리듣기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "TTS preview failed"
 */
router.post('/preview', ctrl.postPreview);

module.exports = router;
