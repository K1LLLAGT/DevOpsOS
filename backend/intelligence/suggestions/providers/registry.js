const recentPanels = require("./recent_panels");
const recentFiles = require("./recent_files");
const smartActions = require("./smart_actions");

const providers = [recentPanels, recentFiles, smartActions];
const pluginProviders = [];

module.exports = {
  all() {
    return [...providers, ...pluginProviders];
  },

  register(provider) {
    pluginProviders.push(provider);
  }
};
