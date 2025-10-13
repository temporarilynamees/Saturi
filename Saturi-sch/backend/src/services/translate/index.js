const axios = require('axios');

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000/translate';

// 프론트엔드에서 사용하는 direction 값을 Python 서버가 이해하는 값으로 변환
const directionMap = {
  'korean to jeju': 'std_to_jeju',
  'jeju to korean': 'jeju_to_std',
};

async function translate(text, direction) {
  const modelDirection = directionMap[direction];
  if (!modelDirection) {
    throw new Error('지원하지 않는 번역 방향입니다.');
  }

  try {
    console.log(`Python 서버로 번역 요청: [${modelDirection}] ${text}`);

    const response = await axios.post(PYTHON_API_URL, {
      sentence: text,
      direction: modelDirection,
    });

    // Python 서버로부터 받은 번역 결과를 반환
    return response.data.translation;

  } catch (error) {
    console.error('Python API 호출 중 에러 발생:', error.message);
    // 클라이언트에게 좀 더 친절한 에러 메시지를 반환
    throw new Error('번역 모델 서버와 통신하는 데 실패했습니다.');
  }
}

module.exports = {
  translate,
};