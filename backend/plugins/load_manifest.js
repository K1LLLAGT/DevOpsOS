const fs = require("fs");
const path = require("path");

module.exports = function loadManifest(pluginDir) {
  const manifestPath = path.join(pluginDir, "plugin.json");

  if (!fs.existsSync(manifestPath)) {
    throw new Error("Missing plugin.json");
  }

  const raw = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(raw);

  return manifest;
};
