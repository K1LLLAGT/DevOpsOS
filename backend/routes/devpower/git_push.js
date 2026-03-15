const git = require("../../devpower/git/git");

module.exports = (req, res) => {
  res.json({ out: git.push() });
};
