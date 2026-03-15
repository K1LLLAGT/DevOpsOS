const recency = {};

module.exports = {
  markUsed(id) {
    recency[id] = Date.now();
  },

  getBoost(result) {
    let score = 0;

    // Category boost
    if (result.category === "Commands") score += 20;
    if (result.category === "Files") score += 15;
    if (result.category === "Logs") score += 10;

    // Plugin boost
    if (result.plugin) score += 5;

    // Recency boost
    if (recency[result.id]) {
      const age = Date.now() - recency[result.id];
      score += Math.max(0, 50 - age / 2000);
    }

    return score;
  }
};
