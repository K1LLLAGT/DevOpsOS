const fs = require("fs");

module.exports = (req, res) => {
  try {
    const stat = fs.readFileSync("/proc/stat", "utf8").split("\n")[0];
    const parts = stat.split(/\s+/).slice(1).map(Number);

    const [user, nice, system, idle, iowait, irq, softirq] = parts;

    const total = parts.reduce((a, b) => a + b, 0);
    const busy = total - idle;

    res.json({
      ok: true,
      cpu: {
        user,
        system,
        idle,
        busy,
        total,
        usage: busy / total
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "CPU read failed" });
  }
};
