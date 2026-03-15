const engine = require("../../arg/unlock/engine");

module.exports = (req, res) => {
  const { text } = req.body;
  const out = engine.submitFragment(text || "");
  res.json(out);
};
