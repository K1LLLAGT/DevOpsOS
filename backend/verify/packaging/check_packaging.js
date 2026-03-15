const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    const required = [
      "package.json",
      "README.md",
      "CHANGELOG.md",
      "LICENSE",
      "backend",
      "frontend",
      "plugins",
      "data"
    ];

    required.forEach(f => {
      results.push({
        name: "Packaging item exists: " + f,
        ok: fs.existsSync(f)
      });
    });

    return results;
  }
};
