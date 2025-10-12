const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger')
const translation = require('./api/translation/translation.router');
const stt = require('./api/stt/stt.router');

app.use(cors());
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/api/translation', translation);
app.use('/api/stt', stt);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
/**
 * 정적인 html 파일 반환하는 라우트 핸들러들
 */
app.get('/', (req, res) => {
    res.sendFile(path.join());
});

module.exports = app;