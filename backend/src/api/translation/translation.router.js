const controller = require('./translation.controller');
const express = require('express');
const router = express.Router();

router.get('/', controller.translateSentence)

module.exports = router;