const fs = require("fs");

module.exports = (req, res) => {
  try {
    const lines = fs.readFileSync("/proc/net/dev", "utf8").split("\n").slice(2);

    const interfaces = lines
      .filter(l => l.includes(":"))
      .map(l => {
        const [iface, data] = l.split(":");
        const parts = data.trim().split(/\s+/).map(Number);

        return {
          iface: iface.trim(),
          rx: parts[0],
          tx: parts[8]
        };
      });

    res.json({ ok: true, network: interfaces });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Network read failed" });
  }
};
