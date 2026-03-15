const runner = require("../../devpower/remote_build/runner");

module.exports = (req, res) => {
  const { host, script } = req.body;
  res.json({ out: runner.run(host, script) });
};
