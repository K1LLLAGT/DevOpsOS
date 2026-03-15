const engine = require("../../arg/unlock/engine");

module.exports = (req, res) => {
  res.json(engine.state());
};
