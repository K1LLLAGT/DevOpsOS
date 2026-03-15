const fs = require("fs");

function makeDir(path) {
  fs.mkdirSync(path, { recursive: true });
  return true;
}

module.exports = { makeDir };
