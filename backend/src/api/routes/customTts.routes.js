const { Router } = require('express');
const ctrl = require('../controller/customTts.controller');

const router = Router();

// POST /api/custom-tts/
router.post('/', ctrl.generateCustomTts);

module.exports = router;