const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "branding.json");

function load() {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return { name: "DevOpsOS", version: "1.0.0", channel: "stable" }; }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  get() { return load(); },
  set(data) { save({ ...load(), ...data }); }
};
