const handlers = {};

module.exports = {
  register(id, fn) {
    handlers[id] = fn;
  },
  get(id) {
    return handlers[id];
  }
};
