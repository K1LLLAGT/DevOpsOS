const schemaRegistry = require("../../settings/schema_registry");

module.exports = {
  id: "settings",
  title: "Settings",

  search(query) {
    const results = [];

    const global = schemaRegistry.getGlobalSchema();
    for (const key in global) {
      results.push({
        id: "setting:global:" + key,
        title: key,
        subtitle: global[key].description || "Global Setting",
        category: "Settings",
        action: "ui.openPanel.settings",
        payload: { key }
      });
    }

    for (const plugin in schemaRegistry.pluginSchemas) {
      const schema = schemaRegistry.pluginSchemas[plugin];
      for (const key in schema) {
        results.push({
          id: `setting:${plugin}:${key}`,
          title: `${plugin}: ${key}`,
          subtitle: schema[key].description || "Plugin Setting",
          category: "Settings",
          action: "ui.openPanel.settings",
          payload: { plugin, key }
        });
      }
    }

    return results;
  }
};
