const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    const required = [
      "backend/deepos/theme/registry.js",
      "backend/deepos/update/state.js",
      "backend/deepos/profiles/storage.js",
      "backend/deepos/first_run/state.js",
      "backend/deepos/timeline/storage.js",
      "frontend/deepos/theme/theme.js",
      "frontend/deepos/timeline/timeline.js"
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
