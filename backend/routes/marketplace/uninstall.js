const uninstallPlugin = require("../../plugins/uninstall");

module.exports = (req, res) => {
  const { name } = req.body;
  const result = uninstallPlugin(name);
  res.json(result);
};
