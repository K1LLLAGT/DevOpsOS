const fs = require("fs");
const path = require("path");

const ROOT = process.env.DEVOPSOS_ROOT || path.join(process.env.HOME, "DevOpsOS");
const FRAG_PATH = path.join(ROOT, "backend/arg/fragments.json");

function loadFragments() {
  return JSON.parse(fs.readFileSync(FRAG_PATH, "utf8"));
}

function saveFragments(data) {
  fs.writeFileSync(FRAG_PATH, JSON.stringify(data, null, 2));
}

function markFound(id) {
  const data = loadFragments();
  if (!data.found.includes(id)) {
    data.found.push(id);
    saveFragments(data);
  }
}

function isComplete() {
  const data = loadFragments();
  return data.found.length === data.all.length;
}

function repairFragment(id) {
  const data = loadFragments();
  const frag = data.all.find(f => f.id === id);
  if (frag) {
    frag.corrupted = false;
    saveFragments(data);
  }
}

module.exports = {
  loadFragments,
  markFound,
  isComplete,
  repairFragment
};
