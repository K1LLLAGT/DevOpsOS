const bus = require("./bus");
const logEvent = require("./log");

module.exports = function dispatchEvent(type, data = {}) {
  const payload = {
    type,
    ...data,
    time: new Date().toISOString()
  };

  // Log it
  logEvent(type, data);

  // Emit it
  bus.emit(type, payload);

  // Emit wildcard for automation engine
  bus.emit("event.*", payload);

  return payload;
};
