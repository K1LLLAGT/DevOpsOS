const engine = require("../../devpower/containers/engine");

module.exports = (req, res) => {
  res.json({ containers: engine.list() });
};
