const registry = {};

module.exports = {
  register(cmd) {
    registry[cmd.id] = cmd;
  },

  get(id) {
    return registry[id];
  },

  list() {
    return Object.values(registry);
  }
};
