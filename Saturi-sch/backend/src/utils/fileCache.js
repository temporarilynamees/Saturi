const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');

const CACHE_DIR = path.join(__dirname, '../../cache');

function ensureDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function keyToPath(key, ext = 'mp3') {
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  return path.join(CACHE_DIR, `${hash}.${ext}`);
}

exports.readStreamIfExists = (key, ext = 'mp3') => {
  ensureDir();
  const p = keyToPath(key, ext);
  if (!fs.existsSync(p)) return null;
  return { stream: fs.createReadStream(p), filepath: p };
};

exports.saveBuffer = (key, buffer, ext = 'mp3') => {
  ensureDir();
  const p = keyToPath(key, ext);
  fs.writeFileSync(p, buffer);
  return p;
};

exports.bufferToStream = (buffer) => Readable.from(buffer);
