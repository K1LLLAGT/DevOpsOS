const git = require("../../devpower/git/git");

module.exports = (req, res) => {
  res.json({ diff: git.diff() });
};
