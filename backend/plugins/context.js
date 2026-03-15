const vm = require("vm");

module.exports = function createPluginContext(plugin, api, fsSandbox, netSandbox, storage, events) {
  const sandbox = {
    console: {
      log: (...args) => events.emit("log", args),
      warn: (...args) => events.emit("warn", args),
      error: (...args) => events.emit("error", args)
    },

    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,

    module: { exports: {} },
    exports: {},

    devopsos: {
      ...api,
      fs: fsSandbox,
      net: netSandbox,
      storage,
      events
    }
  };

  return vm.createContext(sandbox);
};
const dispatch = require("../events/dispatch");

sandbox.devopsos.events.emit = (type, data) => {
  dispatch(type, { plugin: plugin.manifest.name, ...data });
};
sandbox.devopsos.events.on = (type, fn) => {
  // This is a no-op on backend; frontend plugins use a different API.
};
const logPlugin = require("./logger");

sandbox.console = {
  log: (...args) => logPlugin(plugin.manifest.name, args.join(" ")),
  error: (...args) => logPlugin(plugin.manifest.name, "ERROR: " + args.join(" "))
};
const settings = require("../settings/storage");
const validate = require("../settings/validate");
const schemaRegistry = require("../settings/schema_registry");

sandbox.devopsos.settings = {
  get(key) {
    const raw = settings.getPlugin(plugin.manifest.name);
    const schema = schemaRegistry.getPluginSchema(plugin.manifest.name);
    const validated = validate(schema, raw);
    return validated[key];
  },

  set(key, value) {
    const schema = schemaRegistry.getPluginSchema(plugin.manifest.name);
    if (!schema[key]) throw new Error("Unknown setting: " + key);

    // Type validation
    const def = schema[key];
    if (typeof value !== def.type) {
      throw new Error(`Invalid type for ${key}: expected ${def.type}`);
    }

    // Enum validation
    if (def.enum && !def.enum.includes(value)) {
      throw new Error(`Invalid value for ${key}`);
    }

    settings.setPlugin(plugin.manifest.name, key, value);
  },

  getAll() {
    const raw = settings.getPlugin(plugin.manifest.name);
    const schema = schemaRegistry.getPluginSchema(plugin.manifest.name);
    return validate(schema, raw);
  }
};
const pushNotification = require("../notifications/dispatch");

sandbox.devopsos.notify = (title, message, level = "info", data = {}) => {
  return pushNotification({
    title,
    message,
    level,
    plugin: plugin.manifest.name,
    data
  });
};
sandbox.console.error = (...args) => {
  const msg = args.join(" ");
  logPlugin(plugin.manifest.name, "ERROR: " + msg);

  notify({
    title: `Plugin Console Error`,
    message: msg,
    level: "error",
    plugin: plugin.manifest.name
  });
};
const commandRegistry = require("../commands/registry");

sandbox.devopsos.commands = {
  _handlers: {},

  register(cmd) {
    // Register handler
    this._handlers[cmd.id] = cmd.handler;

    // Register metadata
    commandRegistry.register({
      id: cmd.id,
      title: cmd.title,
      category: cmd.category || plugin.manifest.name,
      plugin: plugin.manifest.name,
      description: cmd.description || "",
      handler: payload => cmd.handler(payload)
    });
  }
};
