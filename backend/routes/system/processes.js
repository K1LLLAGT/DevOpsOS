const { execSync } = require("child_process");

module.exports = (req, res) => {
  try {
    const out = execSync("ps -o pid,ppid,pcpu,pmem,cmd --no-headers").toString();

    const processes = out
      .trim()
      .split("\n")
      .map(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts.shift());
        const ppid = parseInt(parts.shift());
        const cpu = parseFloat(parts.shift());
        const mem = parseFloat(parts.shift());
        const cmd = parts.join(" ");

        return { pid, ppid, cpu, mem, cmd };
      });

    res.json({ ok: true, processes });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Process list failed" });
  }
};
