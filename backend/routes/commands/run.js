const registry = require("../../commands/registry");

module.exports = (req, res) => {
  const { id, payload } = req.body;
  const cmd = registry.get(id);

  if (!cmd) {
    return res.status(404).json({ ok: false, error: "Unknown command" });
  }

  try {
    const result = cmd.handler(payload);
    res.json({ ok: true, result });
  } catch (err) {
    res.json({ ok: false, error: err.toString() });
  }
};
