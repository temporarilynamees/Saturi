// backend/src/controllers/tts.controller.js
const Joi = require('joi');
const tts = require('../services/tts');

const ttsSchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
  speaker: Joi.string().optional(),
  speed: Joi.number().min(0.8).max(1.2).default(1.0),
});

exports.getSpeakers = async (_req, res) => {
  const list = await tts.getSpeakers();
  res.json({ provider: tts.name, speakers: list });
};

exports.postPreview = async (_req, res) => {
  try {
    const { stream, mime } = await tts.synthesize({
      text: '안녕하세요. 미리듣기입니다.',
      speaker: 'female_kr',
      speed: 1.0,
    });
    res.set('Content-Type', mime);
    stream.pipe(res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'TTS preview failed' });
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
    res.status(500).json({ message: 'TTS synthesis failed' });
  }
};
