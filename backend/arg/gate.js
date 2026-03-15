module.exports = (req, res) => {
  const { plugin, phrase } = req.body;

  if (phrase !== "THE ROOT IS WITHIN") {
    return res.json({ allowed: false, reason: "phrase_incorrect" });
  }

  res.json({ allowed: true });
};
