const storage = require("../../profiles/storage");

module.exports = (req, res) => {
  res.json(storage.load());
};
