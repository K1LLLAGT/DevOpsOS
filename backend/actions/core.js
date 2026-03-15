const registry = require("./registry");

registry.register({
  id: "panel.open.marketplace",
  title: "Open Marketplace",
  description: "Navigate to the Marketplace panel",
  category: "Navigation",
  source: "core",
  handler: "frontend",
  payload: { panel: "marketplace" }
});

registry.register({
  id: "panel.open.plugins",
  title: "Open Plugin Manager",
  description: "Navigate to the Plugins panel",
  category: "Navigation",
  source: "core",
  handler: "frontend",
  payload: { panel: "plugins" }
});

registry.register({
  id: "system.refresh",
  title: "Refresh System Data",
  description: "Force refresh of system monitor",
  category: "System",
  source: "core",
  handler: "frontend",
  payload: { action: "refreshSystem" }
});
