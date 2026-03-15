const registry = require("../../commercial/marketplace/registry");

module.exports = (req, res) => {
  res.json({ plugins: registry.list() });
};
