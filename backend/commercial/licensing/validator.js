const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "license.json");
const SECRET = "DEVOPSOS_LICENSE_SECRET_001";

function load() {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return { key: null, valid: false }; }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function verifyKey(key) {
  if (!key) return false;
  const hash = crypto.createHash("sha256").update(key + SECRET).digest("hex");
  return key.endsWith(hash.slice(0, 6));
}

module.exports = {
  get() { return load(); },

  set(key) {
    const valid = verifyKey(key);
    save({ key, valid });
    return valid;
  }
};
