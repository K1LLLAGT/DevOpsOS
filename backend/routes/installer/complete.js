const state = require("../../installer/state");

module.exports = (req, res) => {
  state.complete();
  res.json({ ok: true });
};
