const { execSync } = require("child_process");

function torStart() {
  try {
    execSync("tor &", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function torStop() {
  try {
    execSync("pkill tor");
    return true;
  } catch {
    return false;
  }
}

module.exports = { torStart, torStop };
