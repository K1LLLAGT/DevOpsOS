#!/bin/bash
set -e

# Memory monitor
cat > backend/system/memory.js << 'JS'
const os = require("os");

function getMemory() {
  return {
    total: os.totalmem(),
    free: os.freemem(),
    used: os.totalmem() - os.freemem()
  };
}

module.exports = { getMemory };
JS

# Uptime monitor
cat > backend/system/uptime.js << 'JS'
const os = require("os");

function getUptime() {
  return {
    seconds: os.uptime()
  };
}

module.exports = { getUptime };
JS

# Process list (simple)
cat > backend/system/processes.js << 'JS'
const { execSync } = require("child_process");

function getProcesses() {
  try {
    const output = execSync("ps -A -o pid,ppid,cmd", { encoding: "utf8" });
    return output.split("\n").slice(1).map(line => line.trim()).filter(Boolean);
  } catch (err) {
    return [];
  }
}

module.exports = { getProcesses };
JS

echo "Milestone 2 system monitor expansion installed."
