const math = require("../../embedding/vector_math");
const fuzzy = require("./fuzzy");
const keywords = require("./keywords");

module.exports = {
  score(queryVec, queryText, item) {
    const semantic = math.cosine(queryVec, item.vector || []);
    const fuzzyScore = fuzzy.partialRatio(queryText, item.text || "");
    const keywordScore = keywords.keywordScore(queryText, item.text || "");

    return (
      semantic * 0.55 +
      fuzzyScore * 0.25 +
      keywordScore * 0.20
    );
  }
};
