const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const prefPath = path.join(__dirname, "../../state/preferences.json");
  const defaultPath = path.join(__dirname, "../../state/default_preferences.json");

  try {
    const defaults = JSON.parse(fs.readFileSync(defaultPath, "utf8"));
    fs.writeFileSync(prefPath, JSON.stringify(defaults, null, 2));
    res.json({ ok: true, reset: defaults });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to reset preferences" });
  }
};
