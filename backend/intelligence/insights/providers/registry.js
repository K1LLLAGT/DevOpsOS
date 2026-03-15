const ruleEngine = require("../rules/rules");
const correlationEngine = require("../correlation/engine");

const pluginProviders = [];

module.exports = {
  async run(events) {
    let out = [];

    // Built-in rule engine
    out.push(...ruleEngine.evaluate(events));

    // Built-in correlation engine
    out.push(...correlationEngine.correlate(events));

    // Plugin providers
    for (const p of pluginProviders) {
      try {
        const r = await p(events);
        out.push(...r);
      } catch (e) {
        console.error("Insight provider error:", e);
      }
    }

    // Sort by score
    out.sort((a, b) => b.score - a.score);

    return out.slice(0, 20);
  },

  register(provider) {
    pluginProviders.push(provider);
  }
};
