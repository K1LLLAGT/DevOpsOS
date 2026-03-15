const fs = require("fs");
const path = require("path");

const ROOT = process.env.DEVOPSOS_ROOT || path.join(process.env.HOME, "DevOpsOS");
const FRAG_PATH = path.join(ROOT, "backend/arg/fragments.json");

function loadFragments() {
  return JSON.parse(fs.readFileSync(FRAG_PATH, "utf8"));
}

function rootIsUnlocked() {
  const data = loadFragments();
  return data.found.length === data.all.length;
}

module.exports = { rootIsUnlocked };
