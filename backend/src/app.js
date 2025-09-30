const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/api/translation', require('./api/translation/translation.router'));

/**
 * 정적인 html 파일 반환하는 라우트 핸들러들
 */
app.get('/', (req, res) => {
    res.sendFile(path.join());
});

module.exports = app;