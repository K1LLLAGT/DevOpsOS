const storage = require("../../automation/storage");

module.exports = (req, res) => {
  const data = storage.load();
  res.json({ rules: data.rules });
};
