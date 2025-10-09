const { Router } = require('express');
const ctrl = require('../controllers/pipe.controller');
const router = Router();

// 한 번에: text + direction(jje2ko|ko2jje) -> 번역 -> TTS(mp3) 반환
router.post('/translate-tts', ctrl.translateAndTTS);

module.exports = router;
