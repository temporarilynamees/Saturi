// 상단 그대로
const tts = require('../services/tts');
const Joi = require('joi');

const ttsSchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
  // 🔽 추가: 언어 선택 (기본 ko)
  lang: Joi.string().valid('ko', 'jje').default('ko'),
  speaker: Joi.string().optional(),
  speed: Joi.number().min(0.8).max(1.2).default(1.0),
});

exports.getSpeakers = async (req, res) => {
  const lang = (req.query.lang || 'ko').toLowerCase();
  const list = await tts.getSpeakers(lang);
  res.json({ provider: tts.name, lang, speakers: list });
};

exports.postPreview = async (_req, res) => {
  try {
    const { stream, mime } = await tts.synthesize({
      text: '안녕하세요. 미리듣기입니다.',
      lang: 'ko', speaker: 'female_kr', speed: 1.0,
    });
    res.set('Content-Type', mime);
    stream.pipe(res);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    res.status(status).json({ message: e.message || 'TTS preview failed' });
  }
};

exports.postTTS = async (req, res) => {
  const { value, error } = ttsSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  try {
    const { stream, mime, fromCache } = await tts.synthesize(value);
    res.set('Content-Type', mime);
    if (fromCache) res.set('X-Cache', 'HIT');
    stream.pipe(res);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    res.status(status).json({ message: e.message || 'TTS synthesis failed' });
  }
};
