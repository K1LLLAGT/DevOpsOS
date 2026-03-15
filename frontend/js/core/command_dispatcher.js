import { openPanel } from "./linking.js";

export function dispatchFrontendCommand(cmd) {
  if (cmd.id.startsWith("ui.openPanel.")) {
    const panel = cmd.id.replace("ui.openPanel.", "");
    openPanel(panel);
    return true;
  }

  if (cmd.id.startsWith("ui.devtools.")) {
    const tab = cmd.id.replace("ui.devtools.", "");
    openPanel("devtools", { tab });
    return true;
  }

  if (cmd.id === "ui.openNotifications") {
    openPanel("notifications");
    return true;
  }

  if (cmd.id === "ui.openSettings") {
    openPanel("settings");
    return true;
  }

  return false;
}
if (cmd.plugin && cmd.id.endsWith(".open")) {
  openPanel("plugin-" + cmd.plugin);
  return true;
}
if (cmd.id === "automation.trigger" && cmd.payload?.rule) {
  openPanel("devtools", { tab: "automation", rule: cmd.payload.rule });
  return false; // backend still runs it
}

if (cmd.id === "task.run" && cmd.payload?.task) {
  openPanel("devtools", { tab: "tasks", task: cmd.payload.task });
  return false;
}
if (cmd.id.startsWith("devtools.openTab.")) {
  const tab = cmd.id.replace("devtools.openTab.", "");
  openPanel("devtools", { tab });
  return true;
}
