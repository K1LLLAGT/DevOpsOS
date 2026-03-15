const { markFound, loadFragments } = require("./fragment");

module.exports = (req, res) => {
  const { fragment } = req.body;
  markFound(fragment);
  const data = loadFragments();
  const frag = data.all.find(f => f.id === fragment);
  res.json({ revealed: true, fragment: frag });
};
