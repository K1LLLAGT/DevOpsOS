const fs = require("fs");
const path = require("path");

const themeDir = path.join(process.cwd(), "frontend/themes");

function listThemes() {
  if (!fs.existsSync(themeDir)) return [];
  return fs.readdirSync(themeDir)
    .filter(f => f.endsWith(".css"))
    .map(f => f.replace(".css", ""));
}

module.exports = { listThemes };
