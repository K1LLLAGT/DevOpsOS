const engine = require("../../arg/anomalies/engine");

module.exports = (req, res) => {
  const a = engine.maybeAnomaly();
  res.json({ anomaly: a });
};
