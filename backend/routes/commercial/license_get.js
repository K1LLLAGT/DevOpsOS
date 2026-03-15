const validator = require("../../commercial/licensing/validator");

module.exports = (req, res) => {
  res.json(validator.get());
};
