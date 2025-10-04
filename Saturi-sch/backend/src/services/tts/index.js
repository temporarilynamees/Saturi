// backend/src/services/tts/index.js
const NodeCache = require('node-cache');
const normalize = require('./normalizer');
const gttsProvider = require('./providers/gtts');
// const clovaProvider = require('./providers/clova');
// const googleProvider = require('./providers/google');
// const coquiProvider = require('./providers/coqui');

const cache = new NodeCache({ stdTTL: 60 * 60 }); // 1시간
const providerName = process.env.TTS_PROVIDER || 'gtts';

const providers = {
  gtts: gttsProvider,
  // clova: clovaProvider,
  // google: googleProvider,
  // coqui: coquiProvider,
};

const provider = providers[providerName] || gttsProvider;

module.exports = {
  name: provider.name,
  async getSpeakers() {
    return provider.getSpeakers ? provider.getSpeakers() : ['female_kr', 'male_kr'];
  },
  async synthesize({ text, speaker = 'female_kr', speed = 1.0 }) {
    const norm = normalize(text);
    const key = `${provider.name}:${speaker}:${speed}:${norm}`;
    const hit = cache.get(key);
    if (hit) return { ...hit, fromCache: true };

    const result = await provider.synthesize({ text: norm, speaker, speed });
    cache.set(key, result);
    return { ...result, fromCache: false };
  },
};
