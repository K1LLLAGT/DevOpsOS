const engine = require("../../arg/whispers/engine");

module.exports = (req, res) => {
  const { context } = req.body;
  const w = engine.maybeWhisper(context || {});
  res.json({ whisper: w });
};
