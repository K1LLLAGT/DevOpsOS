const runner = require("../../verify/run");

module.exports = (req, res) => {
  res.json(runner.runAll());
};
