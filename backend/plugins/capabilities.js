module.exports = function resolveCapabilities(manifest) {
  const caps = new Set(manifest.capabilities || []);

  const api = {};

  if (caps.has("ui.panel")) {
    api.ui = require("../api/ui");
  }

  if (caps.has("storage.read") || caps.has("storage.write")) {
    api.storage = require("../api/storage");
  }

  if (caps.has("system.info")) {
    api.system = require("../api/system");
  }

  return api;
};
