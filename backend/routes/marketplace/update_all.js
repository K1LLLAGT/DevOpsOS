const updatePlugin = require("../../plugins/update");
const loadManifest = require("../../plugins/load_manifest");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  const { updates } = req.body;

  const keyPath = path.join(__dirname, "../../registry/public.pem");
  const publicKey = fs.existsSync(keyPath)
    ? fs.readFileSync(keyPath, "utf8")
    : null;

  const results = [];

  for (const u of updates) {
    const pluginDir = path.join(__dirname, "../../plugins/installed", u.name);
    const manifest = loadManifest(pluginDir);

    const result = await updatePlugin(u.entry, publicKey, manifest.version);
    results.push({ name: u.name, result });
  }

  res.json({ ok: true, results });
};
