const storage = require("../../automation/storage");

module.exports = (req, res) => {
  const { id, event, action, payload } = req.body;

  const data = storage.load();
  data.rules.push({ id, event, action, payload: payload || {} });
  storage.save(data);

  res.json({ ok: true });
};
