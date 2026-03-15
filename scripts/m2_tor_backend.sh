#!/bin/bash
set -e

# -----------------------------------------
# Milestone 2 — Step G
# Tor Backend
# -----------------------------------------

# Tor control client
cat > backend/tor/tor_client.js << 'JS'
const net = require("net");

function torCommand(cmd, host = "127.0.0.1", port = 9051, password = "") {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, host, () => {
      socket.write(`AUTHENTICATE "${password}"\r\n`);
    });

    let buffer = "";

    socket.on("data", (data) => {
      buffer += data.toString();

      if (buffer.includes("250 OK")) {
        socket.write(cmd + "\r\n");
      }

      if (buffer.includes("250")) {
        resolve(buffer);
        socket.end();
      }

      if (buffer.includes("515")) {
        reject(new Error("Tor authentication failed"));
        socket.end();
      }
    });

    socket.on("error", reject);
  });
}

async function torStatus() {
  return torCommand("GETINFO status/circuit-established");
}

async function torNewCircuit() {
  return torCommand("SIGNAL NEWNYM");
}

module.exports = { torCommand, torStatus, torNewCircuit };
JS

# Tor bridge fetcher
cat > backend/tor/bridges.js << 'JS'
const https = require("https");

function fetchBridges() {
  return new Promise((resolve, reject) => {
    https.get("https://bridges.torproject.org/bridges?transport=obfs4", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

module.exports = { fetchBridges };
JS

# Tor start/stop (simple)
cat > backend/tor/control.js << 'JS'
const { execSync } = require("child_process");

function torStart() {
  try {
    execSync("tor &", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function torStop() {
  try {
    execSync("pkill tor");
    return true;
  } catch {
    return false;
  }
}

module.exports = { torStart, torStop };
JS

# Patch server.js with new WebSocket routes
sed -i '/default:/i \
      case "tor_status": {\n\
        const { torStatus } = require("./tor/tor_client");\n\
        torStatus()\n\
          .then(result => ws.send(JSON.stringify({ type: "tor_status_result", payload: { result } })))\n\
          .catch(err => ws.send(JSON.stringify({ type: "tor_status_error", payload: { error: err.message } })));\n\
        break;\n\
      }\n\
\n\
      case "tor_new_circuit": {\n\
        const { torNewCircuit } = require("./tor/tor_client");\n\
        torNewCircuit()\n\
          .then(result => ws.send(JSON.stringify({ type: "tor_new_circuit_result", payload: { result } })))\n\
          .catch(err => ws.send(JSON.stringify({ type: "tor_new_circuit_error", payload: { error: err.message } })));\n\
        break;\n\
      }\n\
\n\
      case "tor_bridges": {\n\
        const { fetchBridges } = require("./tor/bridges");\n\
        fetchBridges()\n\
          .then(bridges => ws.send(JSON.stringify({ type: "tor_bridges_result", payload: { bridges } })))\n\
          .catch(err => ws.send(JSON.stringify({ type: "tor_bridges_error", payload: { error: err.message } })));\n\
        break;\n\
      }\n\
\n\
      case "tor_start": {\n\
        const { torStart } = require("./tor/control");\n\
        const ok = torStart();\n\
        ws.send(JSON.stringify({ type: "tor_start_result", payload: { ok } }));\n\
        break;\n\
      }\n\
\n\
      case "tor_stop": {\n\
        const { torStop } = require("./tor/control");\n\
        const ok = torStop();\n\
        ws.send(JSON.stringify({ type: "tor_stop_result", payload: { ok } }));\n\
        break;\n\
      }\n\
' backend/server.js

echo "Milestone 2 Step G: Tor Backend installed."
