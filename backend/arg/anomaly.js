module.exports = (req, res) => {
  const { plugin, intensity } = req.body;
  res.json({ applied: true, intensity });
};
