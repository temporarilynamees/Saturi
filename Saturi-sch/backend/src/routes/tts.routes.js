// backend/src/routes/tts.routes.js
const { Router } = require('express');
const ctrl = require('../controllers/tts.controller');

const router = Router();

router.get('/speakers', ctrl.getSpeakers);
router.post('/', ctrl.postTTS);            // { text, speaker?, speed? }
router.post('/preview', ctrl.postPreview); // 샘플 합성

module.exports = router;
