const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "sandbox.log");

function log(event, data = {}) {
  const entry = {
    time: new Date().toISOString(),
    event,
    ...data
  };

  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + "\n");
}

module.exports = { log, LOG_PATH };
