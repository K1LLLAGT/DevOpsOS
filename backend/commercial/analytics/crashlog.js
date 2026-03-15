const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "crashlog.json");

function load() {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return []; }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  log(error) {
    const data = load();
    data.unshift({
      error,
      ts: Date.now()
    });
    save(data.slice(0, 500));
  },

  list() {
    return load();
  }
};
