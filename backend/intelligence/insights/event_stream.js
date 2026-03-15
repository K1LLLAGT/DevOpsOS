const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "insight_events.json");

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
  push(event) {
    const data = load();
    data.unshift({
      ...event,
      ts: Date.now()
    });
    save(data.slice(0, 5000));
  },

  recent(limit = 200) {
    return load().slice(0, limit);
  }
};
