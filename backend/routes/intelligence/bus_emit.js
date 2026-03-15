const { bus } = require("../../intelligence/bus/init");

module.exports = (req, res) => {
  const { type, payload } = req.body;
  bus.emit(type, payload || {});
  res.json({ ok: true });
};
