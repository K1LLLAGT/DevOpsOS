const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "notifications.json");

module.exports = {
  load() {
    if (!fs.existsSync(FILE)) return { items: [] };
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  },

  save(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  },

  add(notification) {
    const data = this.load();
    data.items.push(notification);
    this.save(data);
  }
};
