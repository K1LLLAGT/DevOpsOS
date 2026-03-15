const fs = require("fs");
const path = require("path");

function walk(dir, out) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else out.push(full);
  }
}

module.exports = {
  index() {
    const root = process.cwd();
    const files = [];
    walk(root, files);
    return files.map(f => ({
      path: f,
      name: path.basename(f)
    }));
  }
};
