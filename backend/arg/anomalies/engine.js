// Anomaly Engine (Subtle Mode)
// Very rare, controlled UI distortions.

const crypto = require("crypto");

module.exports = {
  maybeAnomaly() {
    // 0.3% chance
    const roll = crypto.randomInt(0, 1000);
    if (roll !== 0) return null;

    return {
      type: "ui_glitch",
      distortion: crypto.randomInt(1, 4)
    };
  }
};
