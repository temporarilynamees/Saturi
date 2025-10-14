const gTTS = require('gtts');

function synthToBuffer(text, langCode = 'ko') {
  return new Promise((resolve, reject) => {
    const tts = new gTTS(text, langCode);
    const chunks = [];
    const s = tts.stream();
    s.on('data', (c) => chunks.push(c));
    s.on('end', () => resolve(Buffer.concat(chunks)));
    s.on('error', reject);
  });
}

module.exports = {
  name: 'gtts',
  ext: 'mp3',
  mime: 'audio/mpeg',
  // gTTS는 ko만 사실상 지원, jje는 미지원 → 스피커 프리셋은 표시용
  async getSpeakers(lang = 'ko') {
    if (lang === 'ko') return ['female_kr', 'male_kr'];
    return []; // jje는 현재 미지원
  },
  async synthesize({ text, lang = 'ko' /*, speaker, speed */ }) {
    if (lang !== 'ko') {
      const err = new Error('gTTS provider does not support Jejueo (jje). Use a provider that supports jje.');
      err.statusCode = 422;
      throw err;
    }
    const buffer = await synthToBuffer(text, 'ko');
    return { buffer, mime: 'audio/mpeg' };
  },
};
