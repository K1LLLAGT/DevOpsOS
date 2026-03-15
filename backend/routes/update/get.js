const state = require("../../update/state");

module.exports = (req, res) => {
  res.json(state.getState());
};
