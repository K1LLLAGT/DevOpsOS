const fs = require("fs");

function watchPlugin(pluginPath, onChange) {
  fs.watch(pluginPath, { persistent: false }, () => {
    onChange(pluginPath);
  });
}

module.exports = { watchPlugin };
