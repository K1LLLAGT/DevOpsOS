const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    const required = [
      "backend/devpower/lsp/manager.js",
      "backend/devpower/git/git.js",
      "backend/devpower/containers/engine.js",
      "backend/devpower/remote_build/runner.js",
      "backend/devpower/indexer/indexer.js",
      "frontend/devpower/git/git.js"
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
