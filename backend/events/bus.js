const EventEmitter = require("events");

class GlobalEventBus extends EventEmitter {}

module.exports = new GlobalEventBus();
