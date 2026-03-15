#!/bin/bash
set -e

# -----------------------------------------
# Milestone 2 — Step H
# Frontend WebSocket Client + Panel Wiring
# -----------------------------------------

mkdir -p frontend/js

# Unified WebSocket client
cat > frontend/js/ws.js << 'JS'
class DevOpsOSBackend {
  constructor(url = "ws://localhost:8765") {
    this.url = url;
    this.ws = null;
    this.handlers = {};
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[WS] Connected to backend");
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const handler = this.handlers[msg.type];
      if (handler) handler(msg.payload || msg);
    };

    this.ws.onclose = () => {
      console.log("[WS] Disconnected");
      setTimeout(() => this.connect(), 1000);
    };
  }

  on(type, callback) {
    this.handlers[type] = callback;
  }

  send(type, payload = {}) {
    this.ws.send(JSON.stringify({ type, payload }));
  }
}

window.backend = new DevOpsOSBackend();
window.backend.connect();
JS

# Terminal panel
cat > frontend/js/terminal.js << 'JS'
window.backend.on("terminal_output", (msg) => {
  const term = document.getElementById("terminal_output");
  term.value += msg.data;
  term.scrollTop = term.scrollHeight;
});

function terminalSend() {
  const input = document.getElementById("terminal_input");
  backend.send("terminal_input", { data: input.value + "\n" });
  input.value = "";
}
JS

# File browser
cat > frontend/js/files.js << 'JS'
window.backend.on("fs_list_result", ({ path, entries }) => {
  const out = document.getElementById("file_list");
  out.innerHTML = entries
    .map(e => \`<div>\${e.type === "dir" ? "📁" : "📄"} \${e.name}</div>\`)
    .join("");
});

function listDir(path) {
  backend.send("fs_list", { path });
}

function readFile(path) {
  backend.send("fs_read", { path });
}

window.backend.on("fs_read_result", ({ path, content }) => {
  document.getElementById("file_editor").value = content;
});
JS

# System monitor
cat > frontend/js/system.js << 'JS'
window.backend.on("system_cpu_result", ({ cpu }) => {
  document.getElementById("cpu_load").innerText =
    cpu.loadavg.join(", ") + " (" + cpu.cores + " cores)";
});

function refreshCPU() {
  backend.send("system_cpu");
}
JS

# Process manager
cat > frontend/js/processes.js << 'JS'
window.backend.on("process_list_result", ({ list }) => {
  const out = document.getElementById("process_list");
  out.innerHTML = list
    .map(p => \`<div>PID \${p.pid} — \${p.cmd}</div>\`)
    .join("");
});

function refreshProcesses() {
  backend.send("process_list");
}

function killProcess(pid) {
  backend.send("process_kill", { pid });
}
JS

# Plugin manager
cat > frontend/js/plugins.js << 'JS'
window.backend.on("plugin_list_result", ({ list }) => {
  const out = document.getElementById("plugin_list");
  out.innerHTML = list
    .map(p => \`<div>\${p.name}</div>\`)
    .join("");
});

function loadPlugins() {
  backend.send("plugin_list");
}

function runPlugin(path) {
  backend.send("plugin_run", { path });
}

window.backend.on("plugin_run_result", ({ result }) => {
  document.getElementById("plugin_output").innerText =
    JSON.stringify(result, null, 2);
});
JS

# SSH panel
cat > frontend/js/ssh.js << 'JS'
function sshConnect() {
  const host = document.getElementById("ssh_host").value;
  const user = document.getElementById("ssh_user").value;
  const pass = document.getElementById("ssh_pass").value;

  backend.send("ssh_connect", {
    host,
    username: user,
    password: pass
  });
}

function sshExec() {
  const cmd = document.getElementById("ssh_cmd").value;
  backend.send("ssh_exec", { command: cmd });
}

window.backend.on("ssh_exec_result", ({ stdout, stderr }) => {
  document.getElementById("ssh_output").value =
    stdout + (stderr ? "\nERR:\n" + stderr : "");
});
JS

# Tor panel
cat > frontend/js/tor.js << 'JS'
function torStatus() {
  backend.send("tor_status");
}

window.backend.on("tor_status_result", ({ result }) => {
  document.getElementById("tor_status").innerText = result;
});

function torNewCircuit() {
  backend.send("tor_new_circuit");
}

function torBridges() {
  backend.send("tor_bridges");
}

window.backend.on("tor_bridges_result", ({ bridges }) => {
  document.getElementById("tor_bridges").innerText = bridges;
});
JS

echo "Milestone 2 Step H: Frontend WebSocket Client + Panel Wiring installed."
