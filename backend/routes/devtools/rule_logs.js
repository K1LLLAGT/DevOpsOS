const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const { id } = req.query;
  const file = path.join(__dirname, "../../automation/logs", id + ".log");

  if (!fs.existsSync(file)) {
    return res.json({ logs: [] });
  }

  const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
  res.json({ logs: lines });
};
