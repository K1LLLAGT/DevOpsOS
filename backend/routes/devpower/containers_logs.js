const engine = require("../../devpower/containers/engine");

module.exports = (req, res) => {
  const { id } = req.query;
  res.json({ logs: engine.logs(id) });
};
