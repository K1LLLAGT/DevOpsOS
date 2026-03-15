const fs = require("fs");
const path = require("path");

const ROOT = process.env.DEVOPSOS_ROOT || path.join(process.env.HOME, "DevOpsOS");
const MERGED = path.join(ROOT, "backend/marketplace/merged.json");

module.exports = (req, res) => {
  const { unlock } = req.body;
  const data = JSON.parse(fs.readFileSync(MERGED, "utf8"));

  data.plugins.forEach(p => {
    if (p.id === unlock) p.hidden = false;
  });

  fs.writeFileSync(MERGED, JSON.stringify(data, null, 2));
  res.json({ unlocked: unlock });
};
