const controller = require('./stt.controller');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

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

router.post('/', upload.single('audio'), controller.speechToText);

module.exports = router;