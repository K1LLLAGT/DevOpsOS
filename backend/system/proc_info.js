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
