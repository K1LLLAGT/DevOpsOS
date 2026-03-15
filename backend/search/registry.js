const providers = {};

module.exports = {
  register(id, provider) {
    providers[id] = provider;
  },

  list() {
    return Object.values(providers);
  }
};
