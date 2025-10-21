const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger')
const translation = require('./api/routes/translation.routes');
const stt = require('./api/routes/stt.routes');
const morgan = require('morgan');
const ttsRoutes = require('./api/routes/tts.routes');
const customTtsRoutes = require('./api/routes/customTts.routes');
const quiz = require('./api/routes/quiz.router'); // 10.17일 퀴즈 라우트 추가
const {
  generalLimiter,
  translationLimiter,
  sttLimiter,
  ttsLimiter,
  quizLimiter
} = require('./api/middleware/rateLimiter'); 

app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cors());

app.use('/', express.static(path.join(__dirname, '../public')));


app.use('/api/translation', translationLimiter, translation);
app.use('/api/stt', sttLimiter, stt);
app.use('/api/quiz', quizLimiter, quiz);
app.use('/api/tts', ttsLimiter, ttsRoutes);
app.use('/api/custom-tts', ttsLimiter, customTtsRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.get('/health', (_req, res) => res.json({ ok: true }));
/**
 * 정적인 html 파일 반환하는 라우트 핸들러들
 */
app.get('/', (req, res) => {
    res.sendFile(path.join());
});

module.exports = app;