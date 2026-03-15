const git = require("../../devpower/git/git");

module.exports = (req, res) => {
  const { msg } = req.body;
  res.json({ out: git.commit(msg) });
};
