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
