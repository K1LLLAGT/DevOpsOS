const generator = require("../../intelligence/embedding/generator");

module.exports = (req, res) => {
  const { text } = req.body;
  const vec = generator.embed(text || "");
  res.json({ vector: vec });
};
