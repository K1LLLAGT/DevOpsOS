const notify = require("../notifications/dispatch");

module.exports = {
  cpuHigh() {
    notify({
      title: "High CPU Usage",
      message: "CPU usage exceeded threshold.",
      level: "warning"
    });
  },
  memoryLow() {
    notify({
      title: "Low Memory",
      message: "Available memory is critically low.",
      level: "error"
    });
  }
};
