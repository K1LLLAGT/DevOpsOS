const { execSync } = require("child_process");

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8" });
  } catch (e) {
    return e.stdout || e.message;
  }
}

module.exports = {
  list() { return run("docker ps --format '{{json .}}'"); },
  images() { return run("docker images --format '{{json .}}'"); },
  logs(id) { return run(`docker logs --tail 200 ${id}`); },
  start(id) { return run(`docker start ${id}`); },
  stop(id) { return run(`docker stop ${id}`); }
};
