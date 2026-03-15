const branding = require("../../commercial/branding/branding");

module.exports = (req, res) => {
  res.json(branding.get());
};
