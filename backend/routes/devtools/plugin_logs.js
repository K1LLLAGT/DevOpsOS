const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const { name } = req.query;
  const file = path.join(__dirname, "../../plugins/logs", name + ".log");

  if (!fs.existsSync(file)) {
    return res.json({ logs: [] });
  }

  const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
  res.json({ logs: lines });
};
