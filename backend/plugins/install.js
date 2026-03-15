const fs = require("fs");
const path = require("path");
const downloadAndExtract = require("./download_extract");
const loadManifest = require("./load_manifest");
const validateManifest = require("./validate_manifest");
const verifySignature = require("../registry/verify_signature");
const { log } = require("./log");

module.exports = async function installPlugin(entry, publicKey) {
  const installDir = path.join(__dirname, "installed", entry.name);

  // Backup old version
  if (fs.existsSync(installDir)) {
    const rollbackDir = path.join(installDir, ".rollback");
    if (fs.existsSync(rollbackDir)) fs.rmSync(rollbackDir, { recursive: true });
    fs.mkdirSync(rollbackDir);
    fs.cpSync(installDir, rollbackDir, { recursive: true });
  } else {
    fs.mkdirSync(installDir);
  }

  try {
    // Download + extract
    await downloadAndExtract(entry.download, installDir);

    // Validate manifest
    const manifest = loadManifest(installDir);
    validateManifest(manifest);

    // Verify signature
    if (publicKey) {
      const ok = verifySignature(entry, publicKey);
      if (!ok) throw new Error("Signature verification failed");
    }

    log("plugin_installed", { name: entry.name, version: entry.version });

    return { ok: true };

  } catch (err) {
    log("plugin_install_failed", { name: entry.name, error: err.toString() });

    // Rollback
    const rollbackDir = path.join(installDir, ".rollback");
    if (fs.existsSync(rollbackDir)) {
      fs.rmSync(installDir, { recursive: true });
      fs.renameSync(rollbackDir, installDir);
    }

    return { ok: false, error: err.toString() };
  }
};
