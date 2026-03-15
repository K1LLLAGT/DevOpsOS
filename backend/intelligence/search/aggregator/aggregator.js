const registry = require("../providers/registry");
const generator = require("../../embedding/generator");
const ranker = require("../ranking/semantic_ranker");

module.exports = {
  async search(query) {
    const queryVec = generator.embed(query);
    const providers = registry.all();

    const results = [];

    for (const p of providers) {
      try {
        const r = await p.search(queryVec, query, ranker);
        results.push(...r);
      } catch (e) {
        console.error("Provider error:", p.id, e);
      }
    }

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, 50);
  }
};
