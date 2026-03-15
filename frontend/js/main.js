// frontend/js/main.js

import { connect } from "./core/ws.js";
import { loadPanel } from "./core/ui.js";

window.addEventListener("DOMContentLoaded", () => {
  connect("ws://127.0.0.1:8080/ws");

  document.querySelectorAll("#top-tabs [data-panel]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-panel");
      loadPanel(id);
    };
  });

  loadPanel("terminal");
});
