const registry = require("./registry");

registry.register({
  id: "system.reload",
  title: "Reload DevOpsOS",
  category: "System",
  handler: () => process.exit(0)
});

registry.register({
  id: "system.openDevTools",
  title: "Open DevTools",
  category: "System",
  handler: () => {
    // frontend will handle this
  }
});
registry.register({
  id: "ui.openPanel.home",
  title: "Open Home Panel",
  category: "Navigation",
  handler: () => {}
});

registry.register({
  id: "ui.openPanel.settings",
  title: "Open Settings",
  category: "Navigation",
  handler: () => {}
});

registry.register({
  id: "ui.openPanel.notifications",
  title: "Open Notification Center",
  category: "Navigation",
  handler: () => {}
});

registry.register({
  id: "ui.devtools.open",
  title: "Open DevTools",
  category: "Navigation",
  handler: () => {}
});
registry.register({
  id: "automation.trigger",
  title: "Trigger Automation Rule",
  category: "Automation",
  handler: payload => {
    const { rule } = payload;
    const executor = require("../automation/execute");
    executor.triggerManual(rule);
  }
});
registry.register({
  id: "task.run",
  title: "Run Background Task",
  category: "Tasks",
  handler: payload => {
    const { task } = payload;
    const tasks = require("../scheduler/tasks");
    tasks.get(task)();
  }
});
registry.register({
  id: "notifications.open",
  title: "Open Notification Center",
  category: "Navigation",
  handler: () => {}
});
registry.register({
  id: "devtools.openTab.events",
  title: "Open DevTools: Events",
  category: "DevTools",
  handler: () => {}
});

registry.register({
  id: "devtools.openTab.plugins",
  title: "Open DevTools: Plugins",
  category: "DevTools",
  handler: () => {}
});

registry.register({
  id: "devtools.openTab.automation",
  title: "Open DevTools: Automation",
  category: "DevTools",
  handler: () => {}
});

registry.register({
  id: "devtools.openTab.tasks",
  title: "Open DevTools: Tasks",
  category: "DevTools",
  handler: () => {}
});
