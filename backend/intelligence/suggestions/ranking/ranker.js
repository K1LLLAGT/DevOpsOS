const math = require("../../embedding/vector_math");
const generator = require("../../embedding/generator");

module.exports = {
  scoreSuggestion(query, suggestion, contextEvents) {
    const now = Date.now();

    // Recency score
    const recent = contextEvents.find(e => e.type === suggestion.type);
    const recency = recent ? Math.exp(-(now - recent.ts) / 600000) : 0;

    // Frequency score
    const freq = contextEvents.filter(e => e.type === suggestion.type).length;
    const frequency = Math.min(freq / 20, 1);

    // Semantic score
    const qv = generator.embed(query || "");
    const sv = generator.embed(suggestion.title + " " + (suggestion.subtitle || ""));
    const semantic = math.cosine(qv, sv);

    return (
      semantic * 0.5 +
      recency * 0.3 +
      frequency * 0.2
    );
  }
};
