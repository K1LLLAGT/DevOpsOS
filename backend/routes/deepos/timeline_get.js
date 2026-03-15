const storage = require("../../deepos/timeline/storage");

module.exports = (req, res) => {
  res.json({ events: storage.load() });
};
