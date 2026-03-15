const state = require("../../deepos/update/state");

module.exports = (req, res) => {
  res.json(state.get());
};
