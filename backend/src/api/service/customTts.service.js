const axios = require('axios');
const AI_SERVER_URL = process.env.AI_SERVER_URL;

/**
 * 텍스트를 받아 Python AI 서버의 VITS 모델을 호출하고,
 * 생성된 오디오 스트림을 반환합니다.
 * @param {string} text - 음성으로 변환할 텍스트
 * @returns {Promise<object>} - { stream, mime } 객체
 */
async function synthesize(text) {
  console.log(`[Custom TTS Service] VITS 모델 호출: "${text}"`);

  try {
    const response = await axios.post(`${AI_SERVER_URL}/generate-tts`, {
      text: text
    }, {
      responseType: 'stream'
    });

    return {
      stream: response.data,
      mime: 'audio/wav'
    };
  } catch (error) {
    console.error('[VITS Service Error]', error.message);
    const newError = new Error('Custom TTS (VITS) server failed');
    newError.statusCode = 503; // Service Unavailable
    throw newError;
  }
}

module.exports = {
  synthesize
};