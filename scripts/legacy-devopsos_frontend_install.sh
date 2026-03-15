#!/usr/bin/env bash
# devopsos_frontend_install.sh
set -euo pipefail

ROOT="${1:-$PWD}"
FRONTEND="$ROOT/frontend"
PANELS="$FRONTEND/panels"
CORE="$FRONTEND/js/core"

mkdir -p "$PANELS/terminal" \
         "$PANELS/editor" \
         "$PANELS/system" \
         "$PANELS/process" \
         "$PANELS/filemanager" \
         "$PANELS/plugins" \
         "$PANELS/ssh" \
         "$PANELS/tor" \
         "$CORE"

# ---------- terminal panel ----------
cat > "$PANELS/terminal/terminal.html" <<"EOF"
<div id="terminal-tabs-bar">
  <div id="terminal-tabs"></div>
  <button id="terminal-tabs-new">+</button>
</div>

<div id="terminal-container"></div>
EOF

cat > "$PANELS/terminal/terminal.js" <<"EOF"
/* terminal.js */

import { on } from "../../js/core/events.js";

let outputEl = null;

export function init() {
  outputEl = document.querySelector("#terminal-output");

  on("terminal:output", handleOutput);
}

export function unload() {
  outputEl = null;
}

function handleOutput(data) {
  if (!outputEl) return;
  outputEl.textContent += data + "\n";
  outputEl.scrollTop = outputEl.scrollHeight;
}
EOF

cat > "$PANELS/terminal/terminal.css" <<"EOF"
#terminal-tabs-bar {
  display: flex;
  background: #1e1e1e;
  padding: 4px;
  align-items: center;
}

#terminal-tabs {
  display: flex;
  flex-grow: 1;
}

.terminal-tab {
  padding: 6px 10px;
  background: #333;
  color: white;
  margin-right: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.terminal-tab.active {
  background: #555;
}

.close-btn {
  margin-left: 8px;
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
}

#terminal-tabs-new {
  padding: 6px 10px;
  background: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.terminal-instance {
  width: 100%;
  height: calc(100% - 40px);
}

.hidden {
  display: none;
}
EOF

cat > "$PANELS/terminal/tabs.js" <<"EOF"
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

  const tab = document.createElement("div");
  tab.className = "terminal-tab";
  tab.id = "tab-" + id;
  tab.innerHTML = `
    <span>${id}</span>
    <button class="close-btn" data-id="${id}">×</button>
  `;

  document.getElementById("terminal-tabs").appendChild(tab);

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

  send({
    type: "terminal:start",
    id,
    cols: term.cols,
    rows: term.rows
  });

  term.onData((data) => {
    send({
      type: "terminal:input",
      id,
      data
    });
  });

  tab.onclick = () => switch_tab(id);

  tab.querySelector(".close-btn").onclick = (e) => {
    e.stopPropagation();
    close_tab(id);
  };

  switch_tab(id);
}

function switch_tab(id) {
  if (activeId === id) return;

  if (activeId && sessions[activeId]) {
    sessions[activeId].container.classList.add("hidden");
    document.getElementById("tab-" + activeId).classList.remove("active");
  }

  activeId = id;
  sessions[id].container.classList.remove("hidden");
  document.getElementById("tab-" + id).classList.add("active");

  sessions[id].fit.fit();
  send({
    type: "terminal:resize",
    id,
    cols: sessions[id].term.cols,
    rows: sessions[id].term.rows
  });
}

function close_tab(id) {
  send({ type: "terminal:kill", id });

  document.getElementById("tab-" + id).remove();
  sessions[id].container.remove();

  delete sessions[id];

  const remaining = Object.keys(sessions);
  if (remaining.length > 0) {
    switch_tab(remaining[0]);
  } else {
    activeId = null;
  }
}

on("terminal:data", (msg) => {
  const { id, chunk } = msg;
  if (sessions[id]) {
    sessions[id].term.write(chunk);
  }
});
EOF

cat > "$PANELS/terminal/system.js" <<"EOF"
/* system.js */

import { on } from "../../js/core/events.js";

export function init() {
  on("system:stats", updateStats);
}

export function unload() {}

function updateStats(stats) {
  document.querySelector("#cpu").textContent = stats.cpu;
  document.querySelector("#ram").textContent = stats.ram;
  document.querySelector("#disk").textContent = stats.disk;
}
EOF

# ---------- editor panel ----------
cat > "$PANELS/editor/editor.html" <<"EOF"
<div id="editor-panel">
  <div id="editor-tabs-bar">
    <div id="editor-tabs"></div>
    <button id="editor-new-tab">+</button>
  </div>

  <div id="editor-container"></div>
</div>
<button onclick="save_active_file()" style="position:absolute; top:5px; right:5px; z-index:10;">
  Save
</button>
EOF

cat > "$PANELS/editor/editor.js" <<"EOF"
/* editor.js */

import { on } from "../../js/core/events.js";

let editorEl = null;

export function init() {
  editorEl = document.querySelector("#editor-content");

  on("editor:load", loadFile);
}

export function unload() {
  editorEl = null;
}

function loadFile(data) {
  if (!editorEl) return;
  editorEl.value = data.content || "";
}
EOF

cat > "$PANELS/editor/editor.css" <<"EOF"
#editor-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #111;
  color: white;
}

#editor-tabs-bar {
  display: flex;
  background: #1e1e1e;
  padding: 4px;
  align-items: center;
}

#editor-tabs {
  display: flex;
  flex-grow: 1;
}

.editor-tab {
  padding: 6px 10px;
  background: #333;
  color: white;
  margin-right: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.editor-tab.active {
  background: #555;
}

.editor-close {
  margin-left: 8px;
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
}

#editor-container {
  flex-grow: 1;
  position: relative;
}

.editor-instance {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}

.hidden {
  display: none;
}
EOF

# ---------- system panel ----------
cat > "$PANELS/system/system.html" <<"EOF"
<div id="system-panel">
  <h2>System Monitor</h2>

  <div class="metric">
    <label>CPU Usage:</label>
    <span id="sys-cpu"></span>
  </div>

  <div class="metric">
    <label>Memory Usage:</label>
    <span id="sys-mem"></span>
    <div id="sys-mem-detail"></div>
  </div>

  <div class="metric">
    <label>Load Average:</label>
    <span id="sys-load"></span>
  </div>

  <div class="metric">
    <label>Uptime:</label>
    <span id="sys-uptime"></span>
  </div>
</div>
EOF

cat > "$PANELS/system/system.css" <<"EOF"
#system-panel {
  padding: 20px;
  background: #111;
  color: white;
  height: 100%;
  overflow-y: auto;
}

.metric {
  margin-bottom: 20px;
  font-size: 18px;
}

.metric label {
  font-weight: bold;
  margin-right: 10px;
}
EOF

cat > "$PANELS/system/system.js" <<"EOF"
/* system.js */

import { on } from "../../js/core/events.js";

export function init() {
  on("system:stats", updateStats);
}

export function unload() {}

function updateStats(stats) {
  const cpu = document.querySelector("#sys-cpu");
  const mem = document.querySelector("#sys-mem");
  const load = document.querySelector("#sys-load");
  const up = document.querySelector("#sys-uptime");
  const memDetail = document.querySelector("#sys-mem-detail");

  if (cpu) cpu.textContent = stats.cpu;
  if (mem) mem.textContent = stats.ram;
  if (load) load.textContent = stats.load;
  if (up) up.textContent = stats.uptime;
  if (memDetail) memDetail.textContent = stats.ram_detail || "";
}
EOF

# ---------- process panel ----------
cat > "$PANELS/process/process.html" <<"EOF"
<div id="process-panel">
  <button id="process-refresh">Refresh</button>

  <table id="process-table">
    <thead>
      <tr>
        <th>PID</th>
        <th>PPID</th>
        <th>Command</th>
        <th>CPU%</th>
        <th>MEM%</th>
        <th>Kill</th>
      </tr>
    </thead>
    <tbody id="process-table-body"></tbody>
  </table>
</div>
EOF

cat > "$PANELS/process/process.css" <<"EOF"
#process-panel {
  padding: 10px;
  color: white;
  background: #111;
  height: 100%;
  overflow-y: auto;
}

#process-table {
  width: 100%;
  border-collapse: collapse;
}

#process-table th, #process-table td {
  padding: 6px;
  border-bottom: 1px solid #333;
}

.kill-btn {
  background: #a00;
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
}
EOF

cat > "$PANELS/process/process.js" <<"EOF"
/* process.js — Milestone‑6 */

import { on } from "../../js/core/events.js";
import { send } from "../../js/core/ws.js";

export function init() {
  send({ type: "process:refresh" });

  const btn = document.querySelector("#process-refresh");
  if (btn) {
    btn.onclick = () => send({ type: "process:refresh" });
  }

  on("process:list", renderProcesses);
}

export function unload() {}

function renderProcesses(list) {
  const tbody = document.querySelector("#process-table-body");
  if (!tbody) return;

  tbody.innerHTML = list
    .map(
      (p) => `
      <tr>
        <td>${p.pid}</td>
        <td>${p.ppid}</td>
        <td>${p.cmd}</td>
        <td>${p.cpu}</td>
        <td>${p.mem}</td>
        <td>
          <button class="kill-btn" data-pid="${p.pid}">Kill</button>
        </td>
      </tr>
    `
    )
    .join("");

  tbody.querySelectorAll(".kill-btn").forEach((btn) => {
    btn.onclick = () => {
      const pid = btn.getAttribute("data-pid");
      send({ type: "process:kill", pid });
    };
  });
}
EOF

# ---------- filemanager panel ----------
cat > "$PANELS/filemanager/filemanager.html" <<"EOF"
<div id="filemanager-panel">
  <div id="filemanager-toolbar">
    <button id="fm-refresh">Refresh</button>
    <button id="fm-up">Up</button>
    <span id="fm-path"></span>
  </div>

  <div id="filemanager-list"></div>
</div>
EOF

cat > "$PANELS/filemanager/filemanager.css" <<"EOF"
#filemanager-panel {
  padding: 10px;
  background: #111;
  color: white;
  height: 100%;
  overflow-y: auto;
}

#filemanager-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

#filemanager-list {
  margin-top: 10px;
}

.fm-item {
  padding: 6px;
  border-bottom: 1px solid #333;
  cursor: pointer;
}

.fm-item:hover {
  background: #222;
}

.fm-dir {
  color: #4fc3f7;
}

.fm-file {
  color: #ffffff;
}
EOF

cat > "$PANELS/filemanager/filemanager.js" <<"EOF"
/* filemanager.js — Step‑Y */

import { send } from "../../js/core/ws.js";
import { on } from "../../js/core/events.js";

let currentPath = "/";

export function init() {
  document.getElementById("fm-path").innerText = currentPath;

  document.getElementById("fm-refresh").onclick = () => {
    request_list();
  };

  document.getElementById("fm-up").onclick = () => {
    if (currentPath !== "/") {
      const parts = currentPath.split("/").filter(Boolean);
      parts.pop();
      currentPath = "/" + parts.join("/");
      if (currentPath === "") currentPath = "/";
      document.getElementById("fm-path").innerText = currentPath;
      request_list();
    }
  };

  request_list();
}

function request_list() {
  send({
    type: "file:list",
    path: currentPath
  });
}

function request_read(path) {
  send({
    type: "file:read",
    path
  });
}

function request_delete(path) {
  send({
    type: "file:delete",
    path
  });
}

function request_mkdir(path) {
  send({
    type: "file:mkdir",
    path
  });
}

on("file:list", (msg) => {
  if (msg.path !== currentPath) return;
  render_list(msg.list);
});

on("file:read", (msg) => {
  const content = msg.content;
  alert("File content:\n\n" + content);
});

on("file:delete:ok", () => {
  request_list();
});

on("file:mkdir:ok", () => {
  request_list();
});

function render_list(items) {
  const list = document.getElementById("filemanager-list");
  list.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "fm-item " + (item.type === "dir" ? "fm-dir" : "fm-file");
    div.innerText = item.name;

    div.onclick = () => {
      if (item.type === "dir") {
        currentPath = currentPath === "/"
          ? "/" + item.name
          : currentPath + "/" + item.name;

        document.getElementById("fm-path").innerText = currentPath;
        request_list();
      } else {
        request_read(currentPath + "/" + item.name);
      }
    };

    div.oncontextmenu = (e) => {
      e.preventDefault();
      if (confirm("Delete " + item.name + "?")) {
        request_delete(currentPath + "/" + item.name);
      }
    };

    list.appendChild(div);
  });

  const mk = document.createElement("div");
  mk.className = "fm-item fm-dir";
  mk.innerText = "[+] New Folder";
  mk.onclick = () => {
    const name = prompt("Folder name:");
    if (name) {
      const path = currentPath === "/" ? "/" + name : currentPath + "/" + name;
      request_mkdir(path);
    }
  };
  list.appendChild(mk);
}
EOF

# ---------- plugins panel ----------
cat > "$PANELS/plugins/plugins.html" <<"EOF"
<div id="plugins-panel">
    <h2>Plugin Marketplace</h2>

    <button id="plugins-refresh">Refresh</button>

    <div id="plugins-list">
        <!-- plugin cards injected dynamically -->
    </div>
</div>
EOF

cat > "$PANELS/plugins/plugins.css" <<"EOF"
#plugins-panel {
    padding: 20px;
    background: #1e1e1e;
    color: #fff;
    font-family: sans-serif;
}

#plugins-panel h2 {
    margin-top: 0;
    color: #81c784;
}

#plugins-refresh {
    padding: 6px 12px;
    margin-bottom: 15px;
    background: #333;
    color: #fff;
    border: none;
    cursor: pointer;
}

#plugins-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.plugin-card {
    background: #252525;
    padding: 15px;
    width: 260px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.plugin-card h3 {
    margin: 0;
    color: #4fc3f7;
}

.plugin-card p {
    margin: 0;
    opacity: 0.8;
}

.plugin-card button {
    padding: 6px 10px;
    border: none;
    cursor: pointer;
    background: #333;
    color: #fff;
}

.install-btn {
    background: #2e7d32;
}

.remove-btn {
    background: #b71c1c;
}
EOF

cat > "$PANELS/plugins/plugins.js" <<"EOF"
/* plugins.js — Milestone‑6 Plugin Marketplace */

import { send } from "../../js/core/ws.js";
import { on } from "../../js/core/events.js";

export function init() {
  document.getElementById("plugins-refresh").onclick = () => {
    request_list();
  };

  request_list();
}

export function unload() {}

function request_list() {
  send({ type: "plugins:refresh" });
}

on("plugins:list", (msg) => {
  renderPlugins(msg.plugins);
});

function renderPlugins(plugins) {
  const list = document.getElementById("plugins-list");
  list.innerHTML = "";

  plugins.forEach((p) => {
    const card = document.createElement("div");
    card.className = "plugin-card";

    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.description || ""}</p>
      <p>Version: ${p.version}</p>
      <p>Trust: ${p.trust || "unknown"}</p>
      <p>Sandbox: ${p.sandbox || "none"}</p>
      <button class="install-btn" data-id="${p.id}">Install</button>
      <button class="remove-btn" data-id="${p.id}">Remove</button>
    `;

    card.querySelector(".install-btn").onclick = () => {
      send({
        type: "plugins:install",
        id: p.id
      });
    };

    card.querySelector(".remove-btn").onclick = () => {
      send({
        type: "plugins:remove",
        id: p.id
      });
    };

    list.appendChild(card);
  });
}
EOF

# ---------- ssh panel ----------
cat > "$PANELS/ssh/ssh.html" <<"EOF"
<div id="ssh-panel">

    <div id="ssh-toolbar">
        <input id="ssh-host" type="text" placeholder="host" />
        <input id="ssh-user" type="text" placeholder="user" />
        <input id="ssh-port" type="number" placeholder="22" value="22" />

        <button id="ssh-connect">Connect</button>
        <button id="ssh-disconnect">Disconnect</button>

        <span id="ssh-status"></span>
    </div>

    <div id="ssh-output"></div>

    <input id="ssh-input" type="text" placeholder="Enter command..." autocomplete="off" />

</div>
EOF

cat > "$PANELS/ssh/ssh.css" <<"EOF"
#ssh-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #000;
    color: #0f0;
    font-family: monospace;
}

#ssh-toolbar {
    display: flex;
    gap: 10px;
    padding: 10px;
    background: #111;
    align-items: center;
}

#ssh-toolbar input {
    padding: 6px;
    background: #222;
    color: #0f0;
    border: none;
}

#ssh-output {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    white-space: pre-wrap;
}

#ssh-input {
    border: none;
    outline: none;
    padding: 10px;
    background: #111;
    color: #0f0;
}
EOF

cat > "$PANELS/ssh/ssh.js" <<"EOF"
/* ssh.js — Milestone‑6 Full SSH Panel */

import { send } from "../../js/core/ws.js";
import { on } from "../../js/core/events.js";

let connected = false;

export function init() {
  const host = document.getElementById("ssh-host");
  const user = document.getElementById("ssh-user");
  const port = document.getElementById("ssh-port");
  const connectBtn = document.getElementById("ssh-connect");
  const disconnectBtn = document.getElementById("ssh-disconnect");
  const input = document.getElementById("ssh-input");
  const output = document.getElementById("ssh-output");

  connectBtn.onclick = () => {
    output.textContent = "";
    send({
      type: "ssh:connect",
      host: host.value,
      user: user.value,
      port: parseInt(port.value, 10)
    });
  };

  disconnectBtn.onclick = () => {
    send({ type: "ssh:disconnect" });
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      const cmd = input.value.trim();
      if (cmd.length > 0 && connected) {
        send({
          type: "ssh:input",
          data: cmd + "\n"
        });
      }
      input.value = "";
    }
  };

  on("ssh:status", updateStatus);
  on("ssh:output", handleOutput);
  on("ssh:connected", () => {
    connected = true;
    updateStatus("connected");
  });
  on("ssh:closed", () => {
    connected = false;
    updateStatus("disconnected");
  });
}

export function unload() {}

function updateStatus(status) {
  const el = document.querySelector("#ssh-status");
  if (el) el.textContent = status;
}

function handleOutput(data) {
  const el = document.querySelector("#ssh-output");
  if (!el) return;

  el.textContent += data;
  el.scrollTop = el.scrollHeight;
}
EOF

# ---------- tor panel ----------
cat > "$PANELS/tor/tor.html" <<"EOF"
<div id="tor-panel">
    <h2>Tor Control</h2>

    <div id="tor-controls">
        <button id="tor-start">Start Tor</button>
        <button id="tor-stop">Stop Tor</button>
        <button id="tor-newid">New Identity</button>
        <span id="tor-status"></span>
    </div>

    <div id="tor-circuit-box">
        <h3>Current Circuit</h3>
        <pre id="tor-circuit">--</pre>
    </div>
</div>
EOF

cat > "$PANELS/tor/tor.css" <<"EOF"
#tor-panel {
    padding: 20px;
    background: #1e1e1e;
    color: #fff;
    font-family: sans-serif;
}

#tor-panel h2 {
    margin-top: 0;
    color: #ce93d8;
}

#tor-controls {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 15px;
}

#tor-controls button {
    padding: 6px 12px;
    background: #333;
    color: #fff;
    border: none;
    cursor: pointer;
}

#tor-status {
    margin-left: auto;
    opacity: 0.8;
}

#tor-circuit-box {
    background: #252525;
    padding: 15px;
    border-radius: 6px;
}

#tor-circuit {
    white-space: pre-wrap;
    color: #b39ddb;
}
EOF

cat > "$PANELS/tor/tor.js" <<"EOF"
/* tor.js — Milestone‑6 Full Tor Control Panel */

import { send } from "../../js/core/ws.js";
import { on } from "../../js/core/events.js";

export function init() {
  const startBtn = document.getElementById("tor-start");
  const stopBtn = document.getElementById("tor-stop");
  const newidBtn = document.getElementById("tor-newid");

  startBtn.onclick = () => {
    send({ type: "tor:start" });
  };

  stopBtn.onclick = () => {
    send({ type: "tor:stop" });
  };

  newidBtn.onclick = () => {
    send({ type: "tor:newid" });
  };

  on("tor:status", updateStatus);
  on("tor:circuit", updateCircuit);
}

export function unload() {}

function updateStatus(status) {
  const el = document.querySelector("#tor-status");
  if (el) el.textContent = status;
}

function updateCircuit(text) {
  const el = document.querySelector("#tor-circuit");
  if (!el) return;

  el.textContent = text;
}
EOF

echo "DevOpsOS frontend panels installed into: $FRONTEND"
