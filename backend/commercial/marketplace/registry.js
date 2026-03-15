const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "plugins");

function validateManifest(m) {
  return (
    typeof m.id === "string" &&
    typeof m.name === "string" &&
    typeof m.version === "string" &&
    typeof m.entry === "string"
  );
}

module.exports = {
  list() {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir)
      .filter(p => fs.existsSync(path.join(dir, p, "manifest.json")))
      .map(p => {
        const manifest = JSON.parse(
          fs.readFileSync(path.join(dir, p, "manifest.json"), "utf8")
        );
        return validateManifest(manifest)
          ? manifest
          : { id: p, name: p, version: "invalid", entry: null };
      });
  }
};
