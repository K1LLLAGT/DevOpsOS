const state = require("../../deepos/first_run/state");

module.exports = (req, res) => {
  res.json({ completed: state.isCompleted() });
};
