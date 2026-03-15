const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const prefPath = path.join(__dirname, "../../state/preferences.json");

  try {
    const current = JSON.parse(fs.readFileSync(prefPath, "utf8"));
    const incoming = req.body || {};

    const updated = {
      ...current,
      ...incoming
    };

    fs.writeFileSync(prefPath, JSON.stringify(updated, null, 2));
    res.json({ ok: true, updated });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to update preferences" });
  }
};
