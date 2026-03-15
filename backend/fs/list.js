// backend/fs/list.js
const fs = require("fs");

function listDir(path) {
  return fs.readdirSync(path, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    type: entry.isDirectory() ? "dir" : "file"
  }));
}

module.exports = { listDir };
