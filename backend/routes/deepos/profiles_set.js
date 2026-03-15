const storage = require("../../deepos/profiles/storage");

module.exports = (req, res) => {
  const { name } = req.body;
  const data = storage.load();
  if (!data.profiles[name]) data.profiles[name] = {};
  data.active = name;
  storage.save(data);
  res.json({ ok: true });
};
