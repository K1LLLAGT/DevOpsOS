const fs = require("fs");
const path = require("path");

module.exports = function createScopedStorage(pluginDir, manifest) {
  const storageDir = path.join(pluginDir, ".storage");
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir);

  const quota = (manifest.storage?.quotaMB || 5) * 1024 * 1024;

  function checkQuota() {
    const files = fs.readdirSync(storageDir);
    let total = 0;
    for (const f of files) {
      const p = path.join(storageDir, f);
      total += fs.statSync(p).size;
    }
    if (total > quota) throw new Error("Storage quota exceeded");
  }

  return {
    read: key => {
      const p = path.join(storageDir, key);
      if (!fs.existsSync(p)) return null;
      return fs.readFileSync(p, "utf8");
    },
    write: (key, value) => {
      const p = path.join(storageDir, key);
      fs.writeFileSync(p, value);
      checkQuota();
    },
    delete: key => {
      const p = path.join(storageDir, key);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    },
    list: () => fs.readdirSync(storageDir)
  };
};
