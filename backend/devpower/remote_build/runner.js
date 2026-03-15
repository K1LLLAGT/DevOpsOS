const { execSync } = require("child_process");

module.exports = {
  run(host, script) {
    try {
      return execSync(`ssh ${host} '${script}'`, { encoding: "utf8" });
    } catch (e) {
      return e.stdout || e.message;
    }
  }
};
