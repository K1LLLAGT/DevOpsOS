const fs = require("fs");

function readMetadata(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, "utf8");
    const meta = content.match(/\/\*meta([\s\S]*?)meta\*\//);
    if (!meta) return null;

    return JSON.parse(meta[1]);
  } catch {
    return null;
  }
}

module.exports = { readMetadata };
