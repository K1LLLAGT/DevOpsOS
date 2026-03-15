import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { send } from '../../js/core/ws.js';
import { on } from '../../js/core/events.js';

let sessions = {};
let activeId = null;

export function terminal_tabs_init() {
  document.getElementById("terminal-tabs-new").onclick = () => {
    create_new_tab();
  };
}

function create_new_tab() {
  const id = "term-" + Date.now();

  // Create tab button
  const tab = document.createElement("div");
  tab.className = "terminal-tab";
  tab.id = "tab-" + id;
  tab.innerHTML = `
    <span>${id}</span>
    <button class="close-btn" data-id="${id}">×</button>
  `;

  document.getElementById("terminal-tabs").appendChild(tab);

  // Create terminal instance
  const term = new Terminal({
    cursorBlink: true,
    fontFamily: "monospace",
    theme: { background: "#000000", foreground: "#ffffff" }
  });

  const fit = new FitAddon();
  term.loadAddon(fit);

  const container = document.createElement("div");
  container.className = "terminal-instance hidden";
  container.id = "container-" + id;

  document.getElementById("terminal-container").appendChild(container);

  term.open(container);
  fit.fit();

  sessions[id] = { term, fit, container };

  // Start PTY session
  send({
    type: "terminal:start",
    id,
    cols: term.cols,
    rows: term.rows
  });

  // Input handler
  term.onData((data) => {
    send({
      type: "terminal:input",
      id,
      data
    });
  });

  // Tab click handler
  tab.onclick = () => switch_tab(id);

  // Close button
  tab.querySelector(".close-btn").onclick = (e) => {
    e.stopPropagation();
    close_tab(id);
  };

  switch_tab(id);
}

function switch_tab(id) {
  if (activeId === id) return;

  // Hide old
  if (activeId && sessions[activeId]) {
    sessions[activeId].container.classList.add("hidden");
    document.getElementById("tab-" + activeId).classList.remove("active");
  }

  // Show new
  activeId = id;
  sessions[id].container.classList.remove("hidden");
  document.getElementById("tab-" + id).classList.add("active");

  // Resize
  sessions[id].fit.fit();
  send({
    type: "terminal:resize",
    id,
    cols: sessions[id].term.cols,
    rows: sessions[id].term.rows
  });
}

function close_tab(id) {
  // Kill PTY
  send({ type: "terminal:kill", id });

  // Remove UI
  document.getElementById("tab-" + id).remove();
  sessions[id].container.remove();

  delete sessions[id];

  // Switch to another tab if needed
  const remaining = Object.keys(sessions);
  if (remaining.length > 0) {
    switch_tab(remaining[0]);
  } else {
    activeId = null;
  }
}

// Receive PTY output
on("terminal:data", (msg) => {
  const { id, chunk } = msg;
  if (sessions[id]) {
    sessions[id].term.write(chunk);
  }
});
