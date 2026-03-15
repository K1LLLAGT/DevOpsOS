const storage = require("../../settings/storage");

module.exports = (req, res) => {
  const { key, value } = req.body;
  storage.setGlobal(key, value);
  res.json({ ok: true });
};
