const state = require("../../deepos/first_run/state");

module.exports = (req, res) => {
  state.complete();
  res.json({ ok: true });
};
