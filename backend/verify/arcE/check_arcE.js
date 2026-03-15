const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    const required = [
      "backend/arg/whispers/engine.js",
      "backend/arg/anomalies/engine.js",
      "backend/arg/clues/clues.js",
      "backend/arg/unlock/engine.js",
      "frontend/arg/whispers/whisper_overlay.js",
      "frontend/arg/anomalies/anomaly_effects.js",
      "frontend/panels/clues/clues.js",
      "frontend/panels/unlock/unlock.js"
    ];

    required.forEach(f => {
      results.push({
        name: "File exists: " + f,
        ok: fs.existsSync(f)
      });
    });

    return results;
  }
};
