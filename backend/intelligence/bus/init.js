const bus = require("./bus");
const registry = require("./subscribers/registry");

module.exports = {
  init() {
    registry.registerAll(bus);
    console.log("[Intelligence Bus] Initialized");
  },

  bus
};
