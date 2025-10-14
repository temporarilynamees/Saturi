const fs = require('fs');
const path = require('path');

function todayName() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `tts-${y}${m}${day}.log`;
}

exports.logTTS = (obj) => {
  try {
    const line = JSON.stringify({ ts: new Date().toISOString(), ...obj }) + '\n';
    const dir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, todayName()), line);
  } catch (_) {}
};
