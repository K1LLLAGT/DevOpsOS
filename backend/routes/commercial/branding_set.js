const branding = require("../../commercial/branding/branding");

module.exports = (req, res) => {
  branding.set(req.body);
  res.json({ ok: true });
};
