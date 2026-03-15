const fs = require("fs");
const path = require("path");

const ROOT = process.env.DEVOPSOS_ROOT || path.join(process.env.HOME, "DevOpsOS");
const SOURCES = path.join(ROOT, "backend/marketplace/sources.json");

module.exports = (req, res) => {
  const { catalog } = req.body;
  const data = JSON.parse(fs.readFileSync(SOURCES, "utf8"));

  data.sources.push({
    id: catalog,
    type: "http",
    url: `http://${catalog}/catalog.json`
  });

  fs.writeFileSync(SOURCES, JSON.stringify(data, null, 2));
  res.json({ added: catalog });
};
