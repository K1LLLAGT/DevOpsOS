const { execSync } = require("child_process");

module.exports = (req, res) => {
  try {
    const out = execSync("df -k /").toString().split("\n")[1].split(/\s+/);

    const total = parseInt(out[1]);
    const used = parseInt(out[2]);
    const free = parseInt(out[3]);

    res.json({
      ok: true,
      storage: {
        total,
        used,
        free,
        usage: used / total
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Storage read failed" });
  }
};
