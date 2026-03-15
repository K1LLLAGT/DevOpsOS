const storage = require("../../deepos/profiles/storage");

module.exports = (req, res) => {
  res.json(storage.load());
};
