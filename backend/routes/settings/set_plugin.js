const storage = require("../../settings/storage");

module.exports = (req, res) => {
  const { plugin, key, value } = req.body;
  storage.setPlugin(plugin, key, value);
  res.json({ ok: true });
};
