const bus = require("../events/bus");
const storage = require("./storage");
const matchRules = require("./match");
const executeRule = require("./execute");

function startAutomationEngine() {
  const { rules } = storage.load();

  bus.on("event.*", event => {
    const matches = matchRules(event, rules);
    matches.forEach(rule => executeRule(rule, event));
  });
}

module.exports = { startAutomationEngine };
