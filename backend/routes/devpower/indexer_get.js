const indexer = require("../../devpower/indexer/indexer");

module.exports = (req, res) => {
  res.json({ files: indexer.index() });
};
