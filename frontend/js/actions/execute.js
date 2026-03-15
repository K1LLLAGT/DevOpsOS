import { openPanel } from "../core/panels.js";
import { notify } from "../ui/notifications/notify.js";

export async function executeAction(action) {
  try {
    if (action.handler === "frontend") {
      if (action.payload.panel) {
        openPanel(action.payload.panel);
      }

      if (action.payload.action && window[action.payload.action]) {
        await window[action.payload.action]();
      }

      notify("success", action.title);
      return;
    }

    if (action.handler === "backend") {
      const res = await fetch("/actions/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: action.id,
          payload: action.payload || {}
        })
      });

      const data = await res.json();

      if (!data.ok) {
        notify("error", data.error);
      } else {
        notify("success", action.title);
      }

      return;
    }

    notify("error", "Unknown action handler");

  } catch (err) {
    notify("error", err.toString());
  }
}
