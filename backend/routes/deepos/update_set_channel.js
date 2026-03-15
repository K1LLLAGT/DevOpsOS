const state = require("../../deepos/update/state");

module.exports = (req, res) => {
  const { channel } = req.body;
  state.setChannel(channel);
  res.json({ ok: true });
};
