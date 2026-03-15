const schemaRegistry = require("../../settings/schema_registry");

module.exports = (req, res) => {
  res.json({
    global: schemaRegistry.getGlobalSchema(),
    plugins: schemaRegistry.pluginSchemas
  });
};
