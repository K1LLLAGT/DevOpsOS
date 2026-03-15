const fs = require("fs");
const path = require("path");
const generator = require("../embedding/generator");
const store = require("../vector_store/store");

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
  indexWorkspace() {
    const root = process.cwd();
    const files = [];
    walk(root, files);

    files.forEach(f => {
      try {
        const content = fs.readFileSync(f, "utf8");
        const vec = generator.embed(content.slice(0, 2000));
        store.add("file:" + f, content.slice(0, 200), vec);
      } catch {}
    });

    return true;
  }
};
