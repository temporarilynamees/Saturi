const Joi = require('joi');
const customTtsService = require('../service/customTts.service');

const schema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
});

exports.generateCustomTts = async (req, res) => {
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const { stream, mime } = await customTtsService.synthesize(value.text);
    res.set('Content-Type', mime);
    stream.pipe(res);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    res.status(status).json({ message: e.message || 'Custom TTS generation failed' });
  }
};