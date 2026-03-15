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
