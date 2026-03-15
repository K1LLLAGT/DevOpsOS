const fs = require("fs");
const { execSync } = require("child_process");

function readCPU() {
  const stat = fs.readFileSync("/proc/stat", "utf8").split("\n")[0];
  const parts = stat.split(/\s+/).slice(1).map(Number);
  const [user, nice, system, idle] = parts;
  const total = parts.reduce((a, b) => a + b, 0);
  const busy = total - idle;
  return busy / total;
}

function readMemory() {
  const meminfo = fs.readFileSync("/proc/meminfo", "utf8").split("\n");
  const get = key => {
    const line = meminfo.find(l => l.startsWith(key));
    return line ? parseInt(line.split(/\s+/)[1]) : 0;
  };
  const total = get("MemTotal:");
  const free = get("MemAvailable:");
  return (total - free) / total;
}

function readStorage() {
  const out = execSync("df -k /").toString().split("\n")[1].split(/\s+/);
  const total = parseInt(out[1]);
  const used = parseInt(out[2]);
  return used / total;
}

function readTemp() {
  try {
    const out = execSync("cat /sys/class/thermal/thermal_zone0/temp").toString();
    return parseInt(out) / 1000;
  } catch {
    return null;
  }
}

function readProcessCount() {
  const out = execSync("ps --no-headers | wc -l").toString();
  return parseInt(out.trim());
}

module.exports = (req, res) => {
  try {
    const cpu = readCPU();
    const mem = readMemory();
    const storage = readStorage();
    const temp = readTemp();
    const procCount = readProcessCount();

    const cpuScore = 1 - cpu;
    const memScore = 1 - mem;
    const storageScore = 1 - storage;
    const tempScore = temp ? Math.max(0, Math.min(1, 1 - temp / 90)) : 1;
    const procScore = Math.max(0, Math.min(1, 1 - procCount / 500));

    const score = Math.max(0, Math.min(100, Math.round(
      cpuScore * 0.35 +
      memScore * 0.25 +
      storageScore * 0.20 +
      tempScore * 0.10 +
      procScore * 0.10
    )));

    res.json({
      ok: true,
      score,
      details: { cpu, mem, storage, temp, procCount }
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: "Health calculation failed" });
  }
};
