// Whisper Engine (Subtle Mode)
// Rare, atmospheric, context-sensitive whispers.

const crypto = require("crypto");

const WHISPERS = [
  "the system remembers",
  "paths converge in silence",
  "not all logs are written",
  "the unseen shapes the seen",
  "root is a direction, not a place"
];

module.exports = {
  maybeWhisper(context) {
    // 1% chance per trigger
    const roll = crypto.randomInt(0, 100);
    if (roll !== 0) return null;

    const idx = crypto.randomInt(0, WHISPERS.length);
    return {
      text: WHISPERS[idx],
      context
    };
  }
};
