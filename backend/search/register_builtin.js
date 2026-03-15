const registry = require("./registry");
registry.register("files", require("./providers/files"));
registry.register("logs", require("./providers/logs"));
registry.register("tasks", require("./providers/tasks"));
registry.register("automations", require("./providers/automations"));
registry.register("notifications", require("./providers/notifications"));
registry.register("commands", require("./providers/commands"));
registry.register("settings", require("./providers/settings"));
registry.register("panels", require("./providers/panels"));
