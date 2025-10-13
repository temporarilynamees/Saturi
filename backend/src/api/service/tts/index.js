const NodeCache = require('node-cache');
const normalize = require('./normalizer');
const gttsProvider = require('./providers/gtts');
// const coquiProvider = require('./providers/coqui'); // jje 지원 예정
const { readStreamIfExists, saveBuffer, bufferToStream } = require('../../utils/fileCache');
const { logTTS } = require('../../utils/logger');

const cache = new NodeCache({ stdTTL: 60 * 60 });
const providerName = process.env.TTS_PROVIDER || 'gtts';

const providers = {
  gtts: gttsProvider,
  // coqui: coquiProvider,
};

const provider = providers[providerName] || gttsProvider;

module.exports = {
  name: provider.name,
  async getSpeakers(lang = 'ko') {
    if (provider.getSpeakers) return provider.getSpeakers(lang);
    return ['female_kr', 'male_kr'];
  },
  async synthesize({ text, lang = 'ko', speaker = 'female_kr', speed = 1.0 }) {
    const started = Date.now();
    const norm = normalize(text);
    const key = `${provider.name}:${lang}:${speaker}:${speed}:${norm}`;

    // 1) 메모리 캐시
    const memHit = cache.get(key);
    if (memHit) {
      logTTS({ event: 'cache_hit_mem', provider: provider.name, lang, len: norm.length, ms: Date.now() - started });
      return { ...memHit, fromCache: true };
    }

    // 2) 디스크 캐시
    const disk = readStreamIfExists(key, provider.ext || 'mp3');
    if (disk) {
      const result = { stream: disk.stream, mime: provider.mime || 'audio/mpeg' };
      cache.set(key, result);
      logTTS({ event: 'cache_hit_disk', provider: provider.name, lang, len: norm.length, ms: Date.now() - started });
      return { ...result, fromCache: true };
    }

    // 3) 합성 실행
    try {
      const synth = await provider.synthesize({ text: norm, lang, speaker, speed });
      // provider.synthesize 가 buffer를 줄 수도 있고 stream을 줄 수도 있다고 가정
      if (synth.buffer) {
        // 버퍼형식이면 파일 저장 후 스트림으로 바꿈
        saveBuffer(key, synth.buffer, provider.ext || 'mp3');
        const result = { stream: bufferToStream(synth.buffer), mime: provider.mime || 'audio/mpeg' };
        cache.set(key, result);
        logTTS({ event: 'synth', provider: provider.name, lang, len: norm.length, ms: Date.now() - started });
        return { ...result, fromCache: false };
      } else {
        // 스트림만 준 경우는 캐시 불가(프로바이더가 mp3 버퍼도 같이 주도록 개선 권장)
        logTTS({ event: 'synth_stream_only', provider: provider.name, lang, len: norm.length, ms: Date.now() - started });
        return { stream: synth.stream, mime: synth.mime, fromCache: false };
      }
    } catch (e) {
      e.statusCode = e.statusCode || 500;
      logTTS({ event: 'error', provider: provider.name, lang, err: e.message });
      throw e;
    }
  },
};
