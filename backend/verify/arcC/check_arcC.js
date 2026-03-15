const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    const required = [
      // C1
      "backend/intelligence/embedding/generator.js",
      "backend/intelligence/vector_store/store.js",
      // C2
      "backend/intelligence/search/aggregator/aggregator.js",
      // C3
      "backend/intelligence/suggestions/engine.js",
      // C4
      "backend/intelligence/insights/engine.js",
      // C5
      "backend/intelligence/bus/init.js"
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
