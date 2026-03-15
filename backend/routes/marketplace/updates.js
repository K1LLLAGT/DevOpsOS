const loadLocal = require("../../registry/load_local");
const loadRemote = require("../../registry/load_remote");
const merge = require("../../registry/merge");
const checkUpdates = require("../../plugins/check_updates");

module.exports = async (req, res) => {
  try {
    const local = loadLocal();
    let remote = { plugins: [] };

    if (process.env.MARKETPLACE_URL) {
      try {
        remote = await loadRemote(process.env.MARKETPLACE_URL);
      } catch {}
    }

    const registry = merge(local, remote);
    const updates = checkUpdates(registry);

    res.json({ ok: true, updates });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.toString() });
  }
};
