const actionRegistry = require("../actions/registry");
const actionHandlers = require("../actions/handlers");
const dispatch = require("../events/dispatch");

module.exports = async function executeRule(rule, event) {
  const action = actionRegistry.list().find(a => a.id === rule.action);
  if (!action) {
    dispatch("automation.error", { rule: rule.id, error: "Unknown action" });
    return;
  }

  try {
    if (action.handler === "backend") {
      const handler = actionHandlers.get(action.id);
      if (!handler) throw new Error("Missing backend handler");
      await handler({ ...action.payload, event });
    } else {
      dispatch("automation.frontend", {
        action: action.id,
        payload: action.payload,
        event
      });
    }

    dispatch("automation.executed", { rule: rule.id, event });

  } catch (err) {
    dispatch("automation.error", {
      rule: rule.id,
      error: err.toString(),
      event
    });
  }
};
const logRule = require("./logger");

logRule(rule.id, `Triggered by event: ${event.type}`);
logRule(rule.id, `Action: ${rule.action}`);

dispatch("automation.trace", {
  rule: rule.id,
  action: rule.action,
  event: event.type
});
const logTask = require("../scheduler/logger");

if (action.handler === "backend" && action.id.includes(".")) {
  logTask(action.id, `Triggered by event: ${event.type}`);
}
const push = require("../notifications/dispatch");

push({
  title: "Automation Executed",
  message: `Rule ${rule.id} triggered by ${event.type}`,
  level: "info",
  data: { rule: rule.id, event: event.type }
});
const notify = require("../notifications/dispatch");

notify({
  title: "Automation Triggered",
  message: `Rule ${rule.id} fired due to ${event.type}`,
  level: "info",
  data: { rule: rule.id, event: event.type }
});
