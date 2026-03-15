const fs = require("fs");

function renamePath(oldPath, newPath) {
  fs.renameSync(oldPath, newPath);
  return true;
}

module.exports = { renamePath };
