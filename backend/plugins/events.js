const EventEmitter = require("events");

module.exports = function createPluginEvents(pluginName) {
  const bus = new EventEmitter();

  bus.emit("lifecycle:init", { plugin: pluginName });

  return bus;
};
