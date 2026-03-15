const fs = require("fs");

module.exports = (req, res) => {
  try {
    const meminfo = fs.readFileSync("/proc/meminfo", "utf8").split("\n");

    const get = key => {
      const line = meminfo.find(l => l.startsWith(key));
      return line ? parseInt(line.split(/\s+/)[1]) : 0;
    };

    const total = get("MemTotal:");
    const free = get("MemAvailable:");
    const used = total - free;

    res.json({
      ok: true,
      memory: {
        total,
        used,
        free,
        usage: used / total
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Memory read failed" });
  }
};
