const storage = require("./storage");
const dispatchEvent = require("../events/dispatch");

module.exports = function pushNotification({
  title,
  message,
  level = "info",
  plugin = null,
  data = {}
}) {
  const item = {
    id: Date.now().toString(),
    time: new Date().toISOString(),
    title,
    message,
    level,
    plugin,
    data
  };

  storage.add(item);

  dispatchEvent("notification.created", item);

  return item;
};
