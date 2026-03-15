// backend/core/devmode.js
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const DEV_FLAG_FILE = path.join(process.env.HOME || ROOT_DIR, '.devopsos_root');
const FINAL_PHRASE = 'THE ROOT IS WITHIN';
const MASTER_OVERRIDE = process.env.DEVOPSOS_MASTERKEY || "MASTER-OF-DEVOPS";

let cachedDevMode = null;

function normalizePhrase(s) {
  return String(s || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');
}

function isDevFlagFilePresent() {
  try { return fs.existsSync(DEV_FLAG_FILE); }
  catch { return false; }
}

function writeDevFlagFile() {
  try { fs.writeFileSync(DEV_FLAG_FILE, 'devmode=1\n', { mode: 0o600 }); }
  catch {}
}

function isDevMode() {
  if (cachedDevMode !== null) return cachedDevMode;
  if (process.env.DEVOPSOS_DEV === '1') return (cachedDevMode = true);
  if (isDevFlagFilePresent()) return (cachedDevMode = true);
  return (cachedDevMode = false);
}

function tryUnlockDevMode(phrase) {
  const norm = normalizePhrase(phrase);
  if (norm === normalizePhrase(FINAL_PHRASE) ||
      norm === normalizePhrase(MASTER_OVERRIDE)) {
    writeDevFlagFile();
    cachedDevMode = true;
    return true;
  }
  return false;
}

module.exports = {
  isDevMode,
  tryUnlockDevMode,
  FINAL_PHRASE,
};
