// backend/src/services/tts/normalizer.js
module.exports = function (input) {
  let t = String(input).replace(/\s+/g, ' ').trim();
  // 예: 숫자-단위 간 띄어쓰기 보정
  t = t.replace(/(\d+)년/g, '$1 년').replace(/(\d+)월/g, '$1 월');
  return t;
};
