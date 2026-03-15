const pluginSchemas = {};

let globalSchema = {
  "theme": { type: "string", description: "Active theme name" },
  "telemetry.enabled": { type: "boolean", description: "Enable anonymous telemetry" }
};

module.exports = {
  pluginSchemas,
  getGlobalSchema() {
    return globalSchema;
  },
  registerGlobalSchema(schema) {
    globalSchema = { ...globalSchema, ...schema };
  },
  registerPluginSchema(plugin, schema) {
    pluginSchemas[plugin] = { ...(pluginSchemas[plugin] || {}), ...schema };
  }
};
