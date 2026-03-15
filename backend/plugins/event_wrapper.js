const dispatch = require("../events/dispatch");

module.exports = function wrapPluginEvent(pluginName, handler, payload) {
  try {
    handler(payload);

    dispatch("plugin.event.success", {
      plugin: pluginName,
      event: payload.type
    });

  } catch (err) {
    dispatch("plugin.event.error", {
      plugin: pluginName,
      event: payload.type,
      error: err.toString()
    });
  }
};
const logPlugin = require("./logger");

logPlugin(pluginName, `Event: ${payload.type}`);
const notify = require("../notifications/dispatch");

notify({
  title: `Plugin Error: ${pluginName}`,
  message: err.toString(),
  level: "error",
  plugin: pluginName,
  data: { event: payload.type }
});
