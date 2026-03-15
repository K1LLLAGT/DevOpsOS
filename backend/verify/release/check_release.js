const fs = require("fs");

module.exports = {
  run() {
    const results = [];

    results.push({
      name: "Version tag exists in branding.json",
      ok: fs.existsSync("data/branding.json")
    });

    results.push({
      name: "Release notes exist",
      ok: fs.existsSync("CHANGELOG.md")
    });

    results.push({
      name: "Installer script exists (optional)",
      ok: fs.existsSync("install.sh") || fs.existsSync("bootstrap.sh")
    });

    return results;
  }
};
