// Unlock Engine — subtle, multi-step, deterministic.

const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "arg_unlock.json");

function load() {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return { progress: [], unlocked: false }; }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const FINAL_PHRASE = "THE ROOT IS WITHIN";

module.exports = {
  submitFragment(text) {
    const data = load();

    if (data.unlocked) return data;

    data.progress.push(text.trim().toLowerCase());
    save(data);

    if (data.progress.join(" ").toUpperCase().includes(FINAL_PHRASE)) {
      data.unlocked = true;
      save(data);
    }

    return data;
  },

  state() {
    return load();
  }
};
