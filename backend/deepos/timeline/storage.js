const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "timeline.json");

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

function add(event) {
  const data = load();
  data.unshift({
    ...event,
    ts: Date.now()
  });
  save(data);
}

module.exports = { load, add };
