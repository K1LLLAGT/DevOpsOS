const generator = require("../../intelligence/embedding/generator");
const store = require("../../intelligence/vector_store/store");
const math = require("../../intelligence/embedding/vector_math");

module.exports = (req, res) => {
  const { query } = req.body;
  const qv = generator.embed(query || "");

  const items = store.all().map(item => ({
    id: item.id,
    text: item.text,
    score: math.cosine(qv, item.vector)
  }));

  items.sort((a, b) => b.score - a.score);

  res.json({ results: items.slice(0, 20) });
};
