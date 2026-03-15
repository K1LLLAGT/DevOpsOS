// backend/fs/io.js
const fs = require("fs");

function readFile(path) {
  return fs.readFileSync(path, "utf8");
}

function writeFile(path, content) {
  fs.writeFileSync(path, content, "utf8");
}

module.exports = { readFile, writeFile };
