const fs = require("fs");

function deletePath(path) {
  if (!fs.existsSync(path)) return false;

  const stat = fs.lstatSync(path);

  if (stat.isDirectory()) {
    fs.rmSync(path, { recursive: true, force: true });
  } else {
    fs.unlinkSync(path);
  }

  return true;
}

module.exports = { deletePath };
