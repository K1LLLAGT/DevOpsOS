const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    const required = [
      "backend/commercial/licensing/validator.js",
      "backend/commercial/marketplace/registry.js",
      "backend/commercial/payments/processor.js",
      "backend/commercial/analytics/crashlog.js",
      "backend/commercial/branding/branding.js"
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
