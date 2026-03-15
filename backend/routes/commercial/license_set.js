const validator = require("../../commercial/licensing/validator");

module.exports = (req, res) => {
  const { key } = req.body;
  const valid = validator.set(key);
  res.json({ valid });
};
