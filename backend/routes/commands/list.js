const registry = require("../../commands/registry");

module.exports = (req, res) => {
  res.json({ commands: registry.list() });
};
