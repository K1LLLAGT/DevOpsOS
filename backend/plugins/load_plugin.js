const path = require("path");
const loadManifest = require("./load_manifest");
const validateManifest = require("./validate_manifest");

module.exports = function loadPlugin(pluginDir) {
  const manifest = loadManifest(pluginDir);
  validateManifest(manifest);

  return {
    manifest,
    dir: pluginDir,
    entry: path.join(pluginDir, manifest.entrypoint)
  };
};
plugin.actions = manifest.actions || [];
