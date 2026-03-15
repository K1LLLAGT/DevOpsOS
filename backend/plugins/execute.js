const fs = require("fs");
const path = require("path");
const vm = require("vm");

const resolveCapabilities = require("./capabilities");
const createFSSandbox = require("./fs_sandbox");
const createNetSandbox = require("./net_sandbox");
const createScopedStorage = require("./storage");
const createPluginEvents = require("./events");
const createPluginContext = require("./context");
const attachLifecycle = require("./lifecycle");
const { log } = require("./log");

module.exports = function executePlugin(plugin) {
  const { manifest, entry, dir } = plugin;

  const api = resolveCapabilities(manifest);
  const fsSandbox = createFSSandbox(dir, manifest);
  const netSandbox = createNetSandbox(manifest);
  const storage = createScopedStorage(dir, manifest);
  const events = createPluginEvents(manifest.name);

  const context = createPluginContext(plugin, api, fsSandbox, netSandbox, storage, events);

  const code = fs.readFileSync(entry, "utf8");
  const script = new vm.Script(code, { filename: entry });

  log("plugin_start", { name: manifest.name });

  let instance;
  try {
    script.runInContext(context);
    instance = context.module.exports || context.exports;
  } catch (err) {
    log("plugin_error", { name: manifest.name, error: err.toString() });
    throw err;
  }

  const unload = attachLifecycle(plugin, instance, events);

  log("plugin_ready", { name: manifest.name });

  return { instance, unload, events };
};
const actionRegistry = require("../actions/registry");
const actionHandlers = require("../actions/handlers");

// Register plugin actions
(plugin.actions || []).forEach(a => {
  actionRegistry.register({
    id: a.id,
    title: a.title,
    description: a.description || "",
    category: plugin.manifest.name,
    source: "plugin",
    handler: a.handler,
    payload: a.payload || {}
  });

  if (a.handler === "backend" && typeof instance[a.payload?.task] === "function") {
    actionHandlers.register(a.id, async () => {
      return await instance[a.payload.task]();
    });
  }
});
const taskRegistry = require("../scheduler/tasks");

(plugin.manifest.tasks || []).forEach(t => {
  // Register backend task handler
  if (typeof instance[t.handler] === "function") {
    const taskId = `${plugin.manifest.name}.${t.id}`;
    taskRegistry.register(taskId, instance[t.handler]);

    // Interval-based task
    if (t.interval) {
      global.IntervalScheduler.register(taskId, t.interval, {});
    }

    // Cron-based task
    if (t.cron) {
      global.CronScheduler.register(taskId, t.cron, {});
    }
  }
});
const bus = require("../events/bus");

(plugin.manifest.events || []).forEach(e => {
  const eventName = e.on;
  const handlerName = e.handler;

  if (typeof instance[handlerName] === "function") {
    bus.on(eventName, payload => {
      try {
        instance[handlerName](payload);
      } catch (err) {
        console.error(`Plugin ${plugin.manifest.name} event handler error:`, err);
      }
    });
  }
});
const wrap = require("./event_wrapper");

bus.on(eventName, payload => {
  wrap(plugin.manifest.name, instance[handlerName], payload);
});
const schemaRegistry = require("../settings/schema_registry");

if (plugin.manifest.settings) {
  schemaRegistry.registerPluginSchema(plugin.manifest.name, plugin.manifest.settings);
}
const commandRegistry = require("../commands/registry");

if (plugin.manifest.commands) {
  plugin.manifest.commands.forEach(cmd => {
    commandRegistry.register({
      id: cmd.id,
      title: cmd.title,
      category: cmd.category || plugin.manifest.name,
      plugin: plugin.manifest.name,
      description: cmd.description || "",
      handler: payload => {
        // Forward to plugin sandbox
        if (sandbox.devopsos.commands._handlers[cmd.id]) {
          return sandbox.devopsos.commands._handlers[cmd.id](payload);
        }
      }
    });
  });
}
if (cmd.id.endsWith(".open")) {
  commandRegistry.register({
    id: cmd.id,
    title: cmd.title,
    category: cmd.category || plugin.manifest.name,
    plugin: plugin.manifest.name,
    handler: () => {
      // frontend will handle this
    }
  });
}
