const crashlog = require("../../commercial/analytics/crashlog");

module.exports = (req, res) => {
  res.json({ crashes: crashlog.list() });
};
