const tracker = require("../suggestions/context/context_tracker");
const registry = require("./providers/registry");

module.exports = {
  async generateInsights() {
    const events = tracker.recent(300);
    return await registry.run(events);
  }
};
