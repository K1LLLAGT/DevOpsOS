const fs = require("fs");
const path = require("path");

module.exports = function createFSSandbox(pluginDir, manifest) {
  const allowed = (manifest.permissions.filesystem || []).map(p =>
    path.resolve(pluginDir, p)
  );

  function check(p) {
    const resolved = path.resolve(p);
    if (!allowed.some(a => resolved.startsWith(a))) {
      throw new Error("Filesystem access denied: " + resolved);
    }
  }

  return {
    readFile: (p, enc = "utf8") => {
      check(p);
      return fs.readFileSync(p, enc);
    },
    writeFile: (p, data) => {
      check(p);
      return fs.writeFileSync(p, data);
    },
    exists: p => {
      check(p);
      return fs.existsSync(p);
    }
  };
};
const { log } = require("./log");
log("fs_violation", { path: p });
