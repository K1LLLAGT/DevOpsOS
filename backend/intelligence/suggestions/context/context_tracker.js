// Tracks user actions, panel opens, commands, file opens, etc.
// Lightweight recency + frequency model.

const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "context_log.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  log(event) {
    const data = load();
    data.unshift({
      ...event,
      ts: Date.now()
    });
    save(data.slice(0, 5000)); // keep last 5k events
  },

  recent(limit = 100) {
    return load().slice(0, limit);
  }
};
