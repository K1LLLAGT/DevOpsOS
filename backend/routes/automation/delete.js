const storage = require("../../automation/storage");

module.exports = (req, res) => {
  const { id } = req.body;

  const data = storage.load();
  data.rules = data.rules.filter(r => r.id !== id);
  storage.save(data);

  res.json({ ok: true });
};
