const registry = require("./providers/registry");
const tracker = require("./context/context_tracker");
const ranker = require("./ranking/ranker");

module.exports = {
  async suggest(query) {
    const providers = registry.all();
    const context = tracker.recent(200);

    const all = [];

    for (const p of providers) {
      try {
        const s = await p.suggestions(query);
        all.push(...s);
      } catch (e) {
        console.error("Suggestion provider error:", p.id, e);
      }
    }

    // Score
    all.forEach(s => {
      s.score = ranker.scoreSuggestion(query, s, context);
    });

    // Sort
    all.sort((a, b) => b.score - a.score);

    return all.slice(0, 20);
  }
};
