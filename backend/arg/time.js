module.exports = (req, res) => {
  const { plugin, time } = req.body;
  res.json({ scheduled: true, time });
};
