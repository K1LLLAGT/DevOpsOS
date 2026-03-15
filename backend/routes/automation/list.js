const storage = require("../../automation/storage");

module.exports = (req, res) => {
  res.json(storage.load());
};
