const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    // Check for debug routes
    const suspicious = [
      "backend/routes/debug.js",
      "backend/routes/test.js",
      "backend/routes/dev.js"
    ];

    suspicious.forEach(f => {
      results.push({
        name: "No debug route: " + f,
        ok: !fs.existsSync(f)
      });
    });

    // Check for plaintext secrets
    const secretFiles = [
      "backend/secret.txt",
      "backend/.env",
      "backend/config/secret.json"
    ];

    secretFiles.forEach(f => {
      results.push({
        name: "No plaintext secret: " + f,
        ok: !fs.existsSync(f)
      });
    });

    return results;
  }
};
