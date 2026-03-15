const fs = require("fs");
const path = require("path");

function writeFileAtomic(target, content) {
  const dir = path.dirname(target);
  const tmp = path.join(dir, ".tmp_write_" + Date.now());

  fs.writeFileSync(tmp, content, "utf8");
  fs.renameSync(tmp, target);

  return true;
}

module.exports = { writeFileAtomic };
