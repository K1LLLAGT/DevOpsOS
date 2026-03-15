const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const prefPath = path.join(__dirname, "../../state/preferences.json");

  try {
    const data = JSON.parse(fs.readFileSync(prefPath, "utf8"));
    res.json({ ok: true, prefs: data });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to read preferences" });
  }
};
