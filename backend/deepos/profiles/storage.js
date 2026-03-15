const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "profiles.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { active: "default", profiles: { "default": {} } };
  }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
