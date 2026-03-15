const vm = require("vm");
const path = require("path");
const fs = require("fs");

const resolveCapabilities = require("./capabilities");
const createFSSandbox = require("./fs_sandbox");
const createNetSandbox = require("./net_sandbox");

module.exports = function runPlugin(plugin) {
  const { manifest, entry, dir } = plugin;

  const api = resolveCapabilities(manifest);
  const fsSandbox = createFSSandbox(dir, manifest);
  const netSandbox = createNetSandbox(manifest);

  const sandbox = {
    console,
    require: undefined, // blocked
    module: {},
    exports: {},
    devopsos: {
      ...api,
      fs: fsSandbox,
      net: netSandbox
    }
  };

  const code = fs.readFileSync(entry, "utf8");
  const script = new vm.Script(code, { filename: entry });

  const context = vm.createContext(sandbox);

  script.runInContext(context);

  return sandbox.module.exports || sandbox.exports;
};
const { log } = require("./log");
log("plugin_start", { name: manifest.name });
log("plugin_end", { name: manifest.name });
log("plugin_error", { name: manifest.name, error: err.toString() });
