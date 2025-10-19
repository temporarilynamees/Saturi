const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Saturi API',
      version: '1.0.0',
      description: '사투리 번역 및 음성-텍스트 변환 API',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Translation',
        description: '사투리 번역 API',
      },
      {
        name: 'STT',
        description: '음성-텍스트 변환 API',
      },
      {
        name: 'TTS',
        description: '텍스트-음성 변환 API',
      },
    ],
  },
  apis: ['./src/api/**/*.routes.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;