// backend/src/routes/translation.routes.js

const { Router } = require('express');
const ctrl = require('../controllers/translation.controller');
const router = Router();

// POST /api/translation 요청이 오면 ctrl.translateText 함수를 실행
router.post('/', ctrl.translateText);

module.exports = router;