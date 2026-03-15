const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "events.log");

module.exports = function logEvent(type, data = {}) {
  const entry = {
    time: new Date().toISOString(),
    type,
    ...data
  };

  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + "\n");
};
