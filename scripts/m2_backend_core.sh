#!/bin/bash
set -e

mkdir -p backend/{pty,system,fs,plugins,ssh,tor,utils}

cat > backend/server.js << 'JS'
/**
 * DevOpsOS Backend WebSocket Protocol
 *
 * Incoming messages (from frontend):
 *  - { type: "terminal_input", payload: { data: string } }
 *  - { type: "system_cpu" }
 *  - { type: "fs_list",  payload: { path: string } }
 *  - { type: "fs_read",  payload: { path: string } }
 *  - { type: "fs_write", payload: { path: string, content: string } }
 *
 * Outgoing messages (to frontend):
 *  - { type: "connected", message: string }
 *  - { type: "terminal_output", data: string }
 *  - { type: "terminal_error", data: string }
 *  - { type: "terminal_exit", code: number }
 *  - { type: "system_cpu_result", payload: { cpu: { loadavg: number[], cores: number } } }
 *  - { type: "fs_list_result", payload: { path: string, entries: { name: string, type: "file"|"dir" }[] } }
 *  - { type: "fs_read_result", payload: { path: string, content: string } }
 *  - { type: "fs_write_result", payload: { path: string, ok: boolean } }
 *  - { type: "fs_error", payload: { path: string, error: string } }
 */

const http = require("http");
const WebSocket = require("ws");
const { createPTY } = require("./pty/pty");
const { getCPU } = require("./system/cpu");
const { listDir } = require("./fs/list");
const { readFile, writeFile } = require("./fs/io");

const PORT = 8765;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("DevOpsOS Backend Running\n");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  const pty = createPTY();

  ws.send(JSON.stringify({ type: "connected", message: "Backend ready" }));

  // PTY → WebSocket
  pty.stdout.on("data", (data) => {
    ws.send(JSON.stringify({ type: "terminal_output", data: data.toString() }));
  });

  pty.stderr.on("data", (data) => {
    ws.send(JSON.stringify({ type: "terminal_error", data: data.toString() }));
  });

  pty.on("exit", (code) => {
    ws.send(JSON.stringify({ type: "terminal_exit", code }));
  });

  // WebSocket → Backend router
  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    const { type, payload } = msg || {};

    switch (type) {
      case "terminal_input": {
        if (typeof payload?.data === "string") {
          pty.stdin.write(payload.data);
        }
        break;
      }

      case "system_cpu": {
        const cpu = getCPU();
        ws.send(JSON.stringify({ type: "system_cpu_result", payload: { cpu } }));
        break;
      }

      case "fs_list": {
        const path = payload?.path || ".";
        try {
          const entries = listDir(path);
          ws.send(
            JSON.stringify({
              type: "fs_list_result",
              payload: { path, entries },
            })
          );
        } catch (err) {
          ws.send(
            JSON.stringify({
              type: "fs_error",
              payload: { path, error: err.message },
            })
          );
        }
        break;
      }

      case "fs_read": {
        const path = payload?.path;
        if (!path) return;
        try {
          const content = readFile(path);
          ws.send(
            JSON.stringify({
              type: "fs_read_result",
              payload: { path, content },
            })
          );
        } catch (err) {
          ws.send(
            JSON.stringify({
              type: "fs_error",
              payload: { path, error: err.message },
            })
          );
        }
        break;
      }

      case "fs_write": {
        const path = payload?.path;
        const content = payload?.content ?? "";
        if (!path) return;
        try {
          writeFile(path, content);
          ws.send(
            JSON.stringify({
              type: "fs_write_result",
              payload: { path, ok: true },
            })
          );
        } catch (err) {
          ws.send(
            JSON.stringify({
              type: "fs_error",
              payload: { path, error: err.message },
            })
          );
        }
        break;
      }

      default:
        // Unknown message type – ignore for now
        break;
    }
  });

  ws.on("close", () => {
    try {
      pty.kill();
    } catch {
      // ignore
    }
  });
});

server.listen(PORT, () => {
  console.log(`DevOpsOS backend listening on port ${PORT}`);
});
JS

cat > backend/pty/pty.js << 'JS'
// backend/pty/pty.js
const { spawn } = require("child_process");

function createPTY() {
  const shell = spawn("sh", [], {
    stdio: ["pipe", "pipe", "pipe"]
  });

  return shell;
}

module.exports = { createPTY };
JS

cat > backend/system/cpu.js << 'JS'
// backend/system/cpu.js
const os = require("os");

function getCPU() {
  return {
    loadavg: os.loadavg(),
    cores: os.cpus().length
  };
}

module.exports = { getCPU };
JS

cat > backend/fs/list.js << 'JS'
// backend/fs/list.js
const fs = require("fs");

function listDir(path) {
  return fs.readdirSync(path, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    type: entry.isDirectory() ? "dir" : "file"
  }));
}

module.exports = { listDir };
JS

cat > backend/fs/io.js << 'JS'
// backend/fs/io.js
const fs = require("fs");

function readFile(path) {
  return fs.readFileSync(path, "utf8");
}

function writeFile(path, content) {
  fs.writeFileSync(path, content, "utf8");
}

module.exports = { readFile, writeFile };
JS

echo "Milestone 2 backend core written to backend/."
