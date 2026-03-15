const fs = require("fs");
const path = require("path");
const loadManifest = require("./load_manifest");
const compareVersions = require("./version_compare");

module.exports = function checkUpdates(registry) {
  const installedDir = path.join(__dirname, "installed");
  if (!fs.existsSync(installedDir)) return [];

  const updates = [];

  for (const entry of registry.plugins) {
    const pluginDir = path.join(installedDir, entry.name);
    if (!fs.existsSync(pluginDir)) continue;

    const manifest = loadManifest(pluginDir);

    const cmp = compareVersions(entry.version, manifest.version);
    if (cmp === 1) {
      updates.push({
        name: entry.name,
        current: manifest.version,
        latest: entry.version,
        entry
      });
    }
  }

  return updates;
};
