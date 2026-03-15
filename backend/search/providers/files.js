const fs = require("fs");
const path = require("path");

module.exports = {
  id: "files",
  title: "Files",

  search(query) {
    const root = process.cwd();
    const results = [];

    function walk(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
          walk(full);
        } else {
          results.push({
            id: "file:" + full,
            title: item,
            subtitle: full.replace(root, ""),
            category: "Files",
            action: "ui.openPanel.files",
            payload: { path: full }
          });
        }
      }
    }

    walk(root);
    return results;
  }
};
