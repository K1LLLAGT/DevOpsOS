const storage = require("../../notifications/storage");

module.exports = (req, res) => {
  res.json(storage.load());
};
