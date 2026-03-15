const engine = require("../../intelligence/suggestions/engine");

module.exports = async (req, res) => {
  const { query } = req.body;
  const results = await engine.suggest(query || "");
  res.json({ results });
};
