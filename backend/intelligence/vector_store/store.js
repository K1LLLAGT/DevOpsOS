const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "vector_store.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { items: [] };
  }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  add(id, text, vector) {
    const db = load();
    db.items.push({ id, text, vector });
    save(db);
  },

  all() {
    return load().items;
  }
};
