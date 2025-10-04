const controller = require('./stt.controller');
const express = require('express');
const router = express.Router();

router.post('/', controller.speechToText);

module.exports = router;