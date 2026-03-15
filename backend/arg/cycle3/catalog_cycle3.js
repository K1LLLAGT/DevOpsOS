module.exports = (req, res) => {
  const { installed } = req.body;

  const mirrored = installed.map(p => ({
    id: `mirror_${p}`,
    name: `Mirror of ${p}`,
    category: "MIRROR",
    hidden: false
  }));

  res.json({ plugins: mirrored });
};
