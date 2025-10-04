// backend/src/app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const ttsRoutes = require('./routes/tts.routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

// 정적 제공(필요 시 실제 폴더 경로 지정)
app.use('/', express.static(path.join(__dirname, '../public')));

// 헬스체크
app.get('/health', (_req, res) => res.json({ ok: true }));

// TTS API
app.use('/api/tts', ttsRoutes);

module.exports = app;
