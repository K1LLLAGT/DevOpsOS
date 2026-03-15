const vm = require("vm");
const fs = require("fs");

function runPlugin(pluginPath, context = {}) {
  const code = fs.readFileSync(pluginPath, "utf8");

  const sandbox = {
    console,
    module: {},
    exports: {},
    require,
    ...context
  };

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  return sandbox.module.exports || sandbox.exports;
}

module.exports = { runPlugin };
