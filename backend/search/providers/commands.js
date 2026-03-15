const registry = require("../../commands/registry");

module.exports = {
  id: "commands",
  title: "Commands",

  search(query) {
    return registry.list().map(cmd => ({
      id: "command:" + cmd.id,
      title: cmd.title,
      subtitle: cmd.category,
      category: "Commands",
      action: cmd.id,
      payload: {}
    }));
  }
};
