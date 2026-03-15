module.exports = function attachLifecycle(plugin, instance, events) {
  if (typeof instance.onLoad === "function") {
    instance.onLoad();
    events.emit("lifecycle:load", { plugin: plugin.manifest.name });
  }

  if (typeof instance.onEvent === "function") {
    events.on("event", data => instance.onEvent(data.name, data.payload));
  }

  return () => {
    if (typeof instance.onUnload === "function") {
      instance.onUnload();
      events.emit("lifecycle:unload", { plugin: plugin.manifest.name });
    }
  };
};
