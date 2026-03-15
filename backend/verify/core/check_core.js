const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    // Backend directory check
    const backendDirs = [
      "backend",
      "backend/routes",
      "backend/intelligence",
      "backend/commercial",
      "backend/arg"
    ];

    backendDirs.forEach(dir => {
      results.push({
        name: "Directory exists: " + dir,
        ok: fs.existsSync(dir)
      });
    });

    // Frontend directory check
    const frontendDirs = [
      "frontend",
      "frontend/js",
      "frontend/panels",
      "frontend/themes"
    ];

    frontendDirs.forEach(dir => {
      results.push({
        name: "Directory exists: " + dir,
        ok: fs.existsSync(dir)
      });
    });

    return results;
  }
};
