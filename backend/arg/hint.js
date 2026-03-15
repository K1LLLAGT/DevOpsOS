module.exports = (req, res) => {
  const { hint } = req.body;
  res.json({ hint });
};
