#!/usr/bin/env bash
# devopsos_frontend_patch_panels.sh
set -euo pipefail

ROOT="${1:-$PWD}"
PANELS="$ROOT/frontend/panels"

# process.js
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

# filemanager.js
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

# plugins.js
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

# ssh.js
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

# tor.js
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

echo "DevOpsOS frontend panel JS patched in: $PANELS"
