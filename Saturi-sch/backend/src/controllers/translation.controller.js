// backend/src/controllers/translation.controller.js

const Joi = require('joi');
const translateService = require('../services/translate');

// 프론트엔드에서 오는 요청의 데이터 형식을 검증합니다.
const schema = Joi.object({
  sentence: Joi.string().trim().min(1).max(1000).required(),
  direction: Joi.string().valid('jeju to korean', 'korean to jeju').required(),
});

exports.translateText = async (req, res) => {
  // 1. 요청 데이터 검증
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    // 2. 서비스 로직 호출
    const { sentence, direction } = value;
    const translatedText = await translateService.translate(sentence, direction);

    // 3. 성공 결과 응답
    res.json({ translation: translatedText });
  } catch (e) {
    // 4. 에러 처리
    console.error(e);
    res.status(e.statusCode || 500).json({ message: e.message || 'Translation failed' });
  }
};