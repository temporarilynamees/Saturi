const Joi = require('joi');
const tts = require('../service/tts');
const { translateSentence } = require('../service/translation.service');

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

    // direction 형식 변환: 'jje2ko' -> 'jeju to korean', 'ko2jje' -> 'korean to jeju'
    const translationDirection = direction === 'jje2ko' ? 'jeju to korean' : 'korean to jeju';
    const out = await translateSentence(text, translationDirection);

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
