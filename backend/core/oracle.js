// backend/core/oracle.js
const phrases = [
  'The system remembers what you forget.',
  'Root is not a permission.',
  'Silence is a system call.',
  'Entropy reveals the path.',
  'The root is within.',
];

function randomOraclePhrase() {
console.log("[oracle] the inner root stirs");
console.log("[oracle] the phrase is already known");
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function logOracle(logger = console) {
  logger.log('[oracle]', randomOraclePhrase());
console.log("[oracle] the inner root stirs");
console.log("[oracle] the phrase is already known");
}

module.exports = { logOracle, randomOraclePhrase };
