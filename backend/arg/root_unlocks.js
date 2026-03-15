const fs = require("fs");
const path = require("path");

const ROOT = process.env.DEVOPSOS_ROOT || path.join(process.env.HOME, "DevOpsOS");
const MERGED = path.join(ROOT, "backend/marketplace/merged.json");

module.exports = (req, res) => {
  const data = JSON.parse(fs.readFileSync(MERGED, "utf8"));

  data.plugins.push({
    id: "root_echo",
    name: "Root Echo",
    version: "1.0.0",
    category: "ROOT",
    description: "The system speaks plainly.",
    hidden: false
  });

  fs.writeFileSync(MERGED, JSON.stringify(data, null, 2));
  res.json({ added: "root_echo" });
};
