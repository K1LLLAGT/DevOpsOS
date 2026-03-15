const dispatch = require("../../events/dispatch");

module.exports = (req, res) => {
  const { type, data } = req.body;

  if (!type) {
    return res.status(400).json({ ok: false, error: "Missing event type" });
  }

  const payload = dispatch(type, data || {});
  res.json({ ok: true, event: payload });
};
