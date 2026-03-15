const fs = require("fs");
const path = require("path");

const RULES_PATH = path.join(__dirname, "rules.json");

module.exports = {
  load() {
    if (!fs.existsSync(RULES_PATH)) return { rules: [] };
    return JSON.parse(fs.readFileSync(RULES_PATH, "utf8"));
  },
  save(data) {
    fs.writeFileSync(RULES_PATH, JSON.stringify(data, null, 2));
  }
};
