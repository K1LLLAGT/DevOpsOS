const fs = require("fs");
const path = require("path");

function loadPlugins() {
  const dir = path.join(__dirname, "../../plugins");
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".js"))
    .map(f => ({
      name: f.replace(".js", ""),
      path: path.join(dir, f)
    }));
}

module.exports = { loadPlugins };
