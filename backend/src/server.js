require('dotenv').config()
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 정상적으로 실행되었습니다.`);
});

server.on('error', (error) => {
  console.error('서버 실행 중 에러가 발생했습니다:', error);
});