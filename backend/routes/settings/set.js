const storage = require("../../settings/storage");

module.exports = (req, res) => {
  const { key, value } = req.body;
  const current = storage.load();
  current[key] = value;
  storage.save(current);
  res.json({ ok: true });
};
