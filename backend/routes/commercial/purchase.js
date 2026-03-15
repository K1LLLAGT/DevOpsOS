const processor = require("../../commercial/payments/processor");

module.exports = (req, res) => {
  const { pluginId } = req.body;
  const out = processor.purchase(pluginId);
  res.json(out);
};
