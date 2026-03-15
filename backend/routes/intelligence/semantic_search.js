const aggregator = require("../../intelligence/search/aggregator/aggregator");

module.exports = async (req, res) => {
  const { query } = req.body;
  const results = await aggregator.search(query || "");
  res.json({ results });
};
