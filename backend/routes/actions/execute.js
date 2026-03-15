const registry = require("../../actions/registry");
const handlers = require("../../actions/handlers");

module.exports = async (req, res) => {
  const { id, payload } = req.body;

  const action = registry.list().find(a => a.id === id);
  if (!action) {
    return res.status(404).json({ ok: false, error: "Unknown action" });
  }

  if (action.handler !== "backend") {
    return res.status(400).json({ ok: false, error: "Not a backend action" });
  }

  const fn = handlers.get(id);
  if (!fn) {
    return res.status(500).json({ ok: false, error: "No handler registered" });
  }

  try {
    const result = await fn(payload);
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.toString() });
  }
};
