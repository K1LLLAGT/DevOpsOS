const files = require("./files");
const commands = require("./commands");
const panels = require("./panels");

const providers = [files, commands, panels];
const pluginProviders = [];

module.exports = {
  all() {
    return [...providers, ...pluginProviders];
  },

  register(pluginProvider) {
    pluginProviders.push(pluginProvider);
  }
};
