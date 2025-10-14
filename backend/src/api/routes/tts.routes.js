const { Router } = require('express');
const ctrl = require('../controller/tts.controller');

const router = Router();
router.get('/speakers', ctrl.getSpeakers);   // 예: /api/tts/speakers?lang=jje
router.post('/', ctrl.postTTS);
router.post('/preview', ctrl.postPreview);

module.exports = router;
