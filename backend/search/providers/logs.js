const fs = require("fs");
const path = require("path");

module.exports = {
  id: "logs",
  title: "Logs",

  search(query) {
    const dir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir).map(f => ({
      id: "log:" + f,
      title: f,
      subtitle: "Log file",
      category: "Logs",
      action: "ui.openPanel.devtools",
      payload: { tab: "logs", file: f }
    }));
  }
};
