const fs = require("fs");
const path = require("path");

module.exports = function logPlugin(name, message) {
  const file = path.join(__dirname, "logs", name + ".log");
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(file, entry);
};
