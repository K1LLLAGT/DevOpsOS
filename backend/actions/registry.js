const actions = [];

module.exports = {
  register(action) {
    actions.push(action);
  },
  list() {
    return actions;
  }
};
