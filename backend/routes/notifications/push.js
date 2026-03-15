const push = require("../../notifications/dispatch");

module.exports = (req, res) => {
  const { title, message, level, plugin, data } = req.body;

  if (!title || !message) {
    return res.status(400).json({ ok: false, error: "Missing title or message" });
  }

  const item = push({ title, message, level, plugin, data });
  res.json({ ok: true, notification: item });
};
