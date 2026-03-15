#!/bin/bash
set -e

# -----------------------------------------
# Milestone 2 — Step E
# Plugin Runtime Backend
# -----------------------------------------

# Plugin loader
cat > backend/plugins/loader.js << 'JS'
const fs = require("fs");
const path = require("path");

function loadPlugins() {
  const dir = path.join(__dirname, "../../plugins");
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".js"))
    .map(f => ({
      name: f.replace(".js", ""),
      path: path.join(dir, f)
    }));
}

module.exports = { loadPlugins };
JS

# Plugin metadata reader
cat > backend/plugins/metadata.js << 'JS'
const fs = require("fs");

function readMetadata(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, "utf8");
    const meta = content.match(/\/\*meta([\s\S]*?)meta\*\//);
    if (!meta) return null;

    return JSON.parse(meta[1]);
  } catch {
    return null;
  }
}

module.exports = { readMetadata };
JS

# Plugin sandbox executor
cat > backend/plugins/sandbox.js << 'JS'
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
JS

# Plugin hot reload
cat > backend/plugins/hotreload.js << 'JS'
const fs = require("fs");

function watchPlugin(pluginPath, onChange) {
  fs.watch(pluginPath, { persistent: false }, () => {
    onChange(pluginPath);
  });
}

module.exports = { watchPlugin };
JS

# Patch server.js with new WebSocket routes
sed -i '/default:/i \
      case "plugin_list": {\n\
        const { loadPlugins } = require("./plugins/loader");\n\
        const list = loadPlugins();\n\
        ws.send(JSON.stringify({ type: "plugin_list_result", payload: { list } }));\n\
        break;\n\
      }\n\
\n\
      case "plugin_metadata": {\n\
        const { readMetadata } = require("./plugins/metadata");\n\
        const meta = readMetadata(payload?.path);\n\
        ws.send(JSON.stringify({ type: "plugin_metadata_result", payload: { path: payload?.path, meta } }));\n\
        break;\n\
      }\n\
\n\
      case "plugin_run": {\n\
        const { runPlugin } = require("./plugins/sandbox");\n\
        try {\n\
          const result = runPlugin(payload?.path, payload?.context || {});\n\
          ws.send(JSON.stringify({ type: "plugin_run_result", payload: { path: payload?.path, result } }));\n\
        } catch (err) {\n\
          ws.send(JSON.stringify({ type: "plugin_run_error", payload: { path: payload?.path, error: err.message } }));\n\
        }\n\
        break;\n\
      }\n\
\n\
      case "plugin_watch": {\n\
        const { watchPlugin } = require("./plugins/hotreload");\n\
        watchPlugin(payload?.path, () => {\n\
          ws.send(JSON.stringify({ type: "plugin_changed", payload: { path: payload?.path } }));\n\
        });\n\
        ws.send(JSON.stringify({ type: "plugin_watch_result", payload: { path: payload?.path, ok: true } }));\n\
        break;\n\
      }\n\
' backend/server.js

echo "Milestone 2 Step E: Plugin Runtime Backend installed."
