const dispatch = require("../events/dispatch");

module.exports = function startSystemTick(interval = 1000) {
  setInterval(() => {
    dispatch("system.tick", { ts: Date.now() });
  }, interval);
};
const health = require("../system/health");

// Example thresholds
if (cpu > 90) health.cpuHigh();
if (memory < 200) health.memoryLow();
