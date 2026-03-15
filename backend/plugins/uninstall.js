const fs = require("fs");
const path = require("path");
const { log } = require("./log");

module.exports = function uninstallPlugin(name) {
  const dir = path.join(__dirname, "installed", name);

  if (!fs.existsSync(dir)) {
    return { ok: false, error: "Plugin not installed" };
  }

  try {
    fs.rmSync(dir, { recursive: true });
    log("plugin_uninstalled", { name });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
};
