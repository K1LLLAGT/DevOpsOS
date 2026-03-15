const engine = require("../../intelligence/insights/engine");

module.exports = async (req, res) => {
  const results = await engine.generateInsights();
  res.json({ results });
};
