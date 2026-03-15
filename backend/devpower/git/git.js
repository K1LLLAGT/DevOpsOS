const { execSync } = require("child_process");

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8" });
  } catch (e) {
    return e.stdout || e.message;
  }
}

module.exports = {
  status() { return run("git status --short"); },
  diff() { return run("git diff"); },
  commit(msg) { return run(`git commit -am "${msg}"`); },
  push() { return run("git push"); }
};
