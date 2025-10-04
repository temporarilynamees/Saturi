// backend/src/services/tts/providers/gtts.js
const { Readable } = require('stream');
const gTTS = require('gtts');

function toStream(buffer) {
  return Readable.from(buffer);
}

module.exports = {
  name: 'gtts',
  async getSpeakers() {
    // gTTS는 화자 개념 없음 → 프리셋만 표기용
    return ['female_kr', 'male_kr'];
  },
  async synthesize({ text/*, speaker, speed*/ }) {
    // gTTS는 mp3만 출력. 속도/화자 제어는 실제 반영 불가(향후 다른 프로바이더에서 처리)
    const tts = new gTTS(text, 'ko');
    const chunks = [];
    const buf = await new Promise((resolve, reject) => {
      const s = tts.stream();
      s.on('data', (c) => chunks.push(c));
      s.on('end', () => resolve(Buffer.concat(chunks)));
      s.on('error', reject);
    });
    return { stream: toStream(buf), mime: 'audio/mpeg' };
  },
};
