const fuzzy = require("./fuzzy_core");
const semantic = require("./semantic");
const boost = require("./boost");

module.exports = {
  rank(results, query) {
    if (!query) return results;

    return results
      .map(r => {
        const text = (r.title + " " + (r.subtitle || "")).toLowerCase();

        const fuzzyScore = fuzzy.fuzzyScore(text, query);
        const semanticScore = semantic.semanticScore(text, query);
        const boostScore = boost.getBoost(r);

        r.score = fuzzyScore + semanticScore + boostScore;

        return r;
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }
};
