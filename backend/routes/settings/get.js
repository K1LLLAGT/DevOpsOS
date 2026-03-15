const storage = require("../../settings/storage");
const schema = require("../../settings/schema_registry");

module.exports = (req, res) => {
  const values = storage.load();
  res.json({
    values,
    globalSchema: schema.getGlobalSchema(),
    pluginSchemas: schema.pluginSchemas
  });
};
