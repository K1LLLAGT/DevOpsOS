const registry = require("../../deepos/theme/registry");

module.exports = (req, res) => {
  res.json({ themes: registry.listThemes() });
};
