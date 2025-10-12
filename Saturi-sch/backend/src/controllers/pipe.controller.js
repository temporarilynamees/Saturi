const Joi = require('joi');
const tts = require('../services/tts');
const translate = require('../services/translate'); // 스텁(아래 생성)

const schema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
  direction: Joi.string().valid('jje2ko','ko2jje').required(),
  speaker: Joi.string().optional(),
  speed: Joi.number().min(0.8).max(1.2).default(1.0),
});

exports.translateAndTTS = async (req, res) => {
  const { value, error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  try {
    const { text, direction, speaker, speed } = value;
    const out = await translate.translate(text, direction); // 실제 모델로 대체 예정
    const targetLang = direction === 'ko2jje' ? 'jje' : 'ko';
    const { stream, mime, fromCache } = await tts.synthesize({ text: out, lang: targetLang, speaker, speed });
    res.set('Content-Type', mime);
    if (fromCache) res.set('X-Cache', 'HIT');
    stream.pipe(res);
  } catch (e) {
    console.error(e);
    res.status(e.statusCode || 500).json({ message: e.message || 'translate-tts failed' });
  }
};
