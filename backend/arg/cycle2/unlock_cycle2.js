const fs = require("fs");
const path = require("path");

const ROOT = process.env.DEVOPSOS_ROOT || path.join(process.env.HOME, "DevOpsOS");
const STATE = path.join(ROOT, "backend/arg/cycle2/state.json");

module.exports = (req, res) => {
  fs.writeFileSync(STATE, JSON.stringify({ unlocked: true }, null, 2));
  res.json({ unlocked: true });
};
