const installPlugin = require("./install");
const compareVersions = require("./version_compare");

module.exports = async function updatePlugin(entry, publicKey, currentVersion) {
  const cmp = compareVersions(entry.version, currentVersion);

  if (cmp <= 0) {
    return { ok: false, error: "No update available" };
  }

  return await installPlugin(entry, publicKey);
};
