const fs = require("fs");
const path = require("path");

module.exports = function logRule(id, message) {
  const file = path.join(__dirname, "logs", id + ".log");
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(file, entry);
};
