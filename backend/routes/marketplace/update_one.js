const updatePlugin = require("../../plugins/update");
const loadManifest = require("../../plugins/load_manifest");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  const { entry } = req.body;

  const pluginDir = path.join(__dirname, "../../plugins/installed", entry.name);
  const manifest = loadManifest(pluginDir);

  const keyPath = path.join(__dirname, "../../registry/public.pem");
  const publicKey = fs.existsSync(keyPath)
    ? fs.readFileSync(keyPath, "utf8")
    : null;

  const result = await updatePlugin(entry, publicKey, manifest.version);
  res.json(result);
};
