const clues = require("../../arg/clues/clues");

module.exports = (req, res) => {
  res.json({ clues: clues.all() });
};
