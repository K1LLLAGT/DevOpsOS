const state = require("../../installer/state");

module.exports = (req, res) => {
  res.json({ completed: state.isCompleted() });
};
