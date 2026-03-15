const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const pluginsDir = path.join(__dirname, "../../plugins/installed");

  if (!fs.existsSync(pluginsDir)) {
    return res.json({ plugins: [] });
  }

  const plugins = fs.readdirSync(pluginsDir).map(name => {
    const manifestPath = path.join(pluginsDir, name, "plugin.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    return {
      name,
      manifest,
      actions: manifest.actions || [],
      tasks: manifest.tasks || [],
      events: manifest.events || []
    };
  });

  res.json({ plugins });
};
