#!/bin/bash
set -e

# -----------------------------------------
# Process Manager Backend (Milestone 2 — Step C)
# -----------------------------------------

# process list
cat > backend/system/proc_list.js << 'JS'
const { execSync } = require("child_process");

function listProcesses() {
  try {
    const output = execSync("ps -A -o pid,ppid,cmd", { encoding: "utf8" });
    return output
      .split("\n")
      .slice(1)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          pid: parts[0],
          ppid: parts[1],
          cmd: parts.slice(2).join(" ")
        };
      });
  } catch (err) {
    return [];
  }
}

module.exports = { listProcesses };
JS

# process kill
cat > backend/system/proc_kill.js << 'JS'
const { execSync } = require("child_process");

function killProcess(pid) {
  try {
    execSync(`kill -9 ${pid}`);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { killProcess };
JS

# process info
cat > backend/system/proc_info.js << 'JS'
const { execSync } = require("child_process");

function getProcessInfo(pid) {
  try {
    const output = execSync(`ps -p ${pid} -o pid,ppid,cmd,%cpu,%mem`, {
      encoding: "utf8"
    });
    const lines = output.trim().split("\n");
    if (lines.length < 2) return null;

    const parts = lines[1].trim().split(/\s+/);
    return {
      pid: parts[0],
      ppid: parts[1],
      cmd: parts.slice(2, -2).join(" "),
      cpu: parts[parts.length - 2],
      mem: parts[parts.length - 1]
    };
  } catch (err) {
    return null;
  }
}

module.exports = { getProcessInfo };
JS

# Patch server.js to add WebSocket routing
sed -i '/default:/i \
      case "process_list": {\n\
        const { listProcesses } = require("./system/proc_list");\n\
        const list = listProcesses();\n\
        ws.send(JSON.stringify({ type: "process_list_result", payload: { list } }));\n\
        break;\n\
      }\n\
\n\
      case "process_kill": {\n\
        const { killProcess } = require("./system/proc_kill");\n\
        const ok = killProcess(payload?.pid);\n\
        ws.send(JSON.stringify({ type: "process_kill_result", payload: { pid: payload?.pid, ok } }));\n\
        break;\n\
      }\n\
\n\
      case "process_info": {\n\
        const { getProcessInfo } = require("./system/proc_info");\n\
        const info = getProcessInfo(payload?.pid);\n\
        ws.send(JSON.stringify({ type: "process_info_result", payload: { pid: payload?.pid, info } }));\n\
        break;\n\
      }\n\
' backend/server.js

echo "Milestone 2 Step C: Process Manager Backend installed."
