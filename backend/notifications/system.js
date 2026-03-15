const push = require("./dispatch");

module.exports = {
  info(msg) {
    push({ title: "System", message: msg, level: "info" });
  },
  warn(msg) {
    push({ title: "System Warning", message: msg, level: "warning" });
  },
  error(msg) {
    push({ title: "System Error", message: msg, level: "error" });
  }
};
