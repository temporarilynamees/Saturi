const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: {
    error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '15분'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 번역 API에 대한 rate limiter
 * - 1분 동안 최대 20개 요청 허용
 */
const translationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 20, 
  message: {
    error: '번역 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '1분'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * STT(음성 인식) API에 대한 rate limiter
 * - 5분 동안 최대 10개 요청 허용
 */
const sttLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 10, 
  message: {
    error: '음성 인식 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '5분'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * TTS(음성 합성) API에 대한 rate limiter
 * - 5분 동안 최대 30개 요청 허용
 */
const ttsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 30, 
  message: {
    error: 'TTS 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '5분'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 퀴즈 API에 대한 rate limiter
 * - 1분 동안 최대 5개 요청 허용
 */
const quizLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5, 
  message: {
    error: '퀴즈 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '1분'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log('⚠️ Rate limit exceeded for quiz API');
    res.status(429).json({
      error: '퀴즈 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
      retryAfter: '1분'
    });
  },
  skip: (req) => {
    console.log(`🔍 Quiz API 호출: ${req.method} ${req.path}`);
    return false;
  }
});

module.exports = {
  generalLimiter,
  translationLimiter,
  sttLimiter,
  ttsLimiter,
  quizLimiter
};
