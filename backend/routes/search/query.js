const registry = require("../../search/registry");
const fuzzy = require("../../search/fuzzy");

module.exports = async (req, res) => {
  const { query } = req.body;
  const providers = registry.list();

  let results = [];

  for (const p of providers) {
    try {
      const r = await p.search(query);
      results.push(...r);
    } catch (err) {
      console.error("Search provider error:", p.id, err);
    }
  }

  results = fuzzy.rank(results, query);

  res.json({ results });
};
