#!/bin/bash
set -e

# -----------------------------------------
# Milestone 2 — Step F
# SSH Backend
# -----------------------------------------

# SSH client wrapper
cat > backend/ssh/ssh_client.js << 'JS'
const { Client } = require("ssh2");
const fs = require("fs");

function sshConnect({ host, port = 22, username, password, privateKey }) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    const config = { host, port, username };

    if (password) config.password = password;
    if (privateKey) config.privateKey = fs.readFileSync(privateKey);

    conn
      .on("ready", () => resolve(conn))
      .on("error", reject)
      .connect(config);
  });
}

async function sshExec(conn, command) {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) return reject(err);

      let stdout = "";
      let stderr = "";

      stream
        .on("data", (data) => (stdout += data.toString()))
        .stderr.on("data", (data) => (stderr += data.toString()))
        .on("close", () => resolve({ stdout, stderr }));
    });
  });
}

async function sshReadFile(conn, path) {
  return sshExec(conn, `cat "${path}"`);
}

async function sshWriteFile(conn, path, content) {
  return sshExec(conn, `echo '${content.replace(/'/g, "'\\''")}' > "${path}"`);
}

module.exports = { sshConnect, sshExec, sshReadFile, sshWriteFile };
JS

# Patch server.js with new WebSocket routes
sed -i '/default:/i \
      case "ssh_connect": {\n\
        const { sshConnect } = require("./ssh/ssh_client");\n\
        sshConnect(payload)\n\
          .then(conn => {\n\
            ws._ssh = conn;\n\
            ws.send(JSON.stringify({ type: "ssh_connect_result", payload: { ok: true } }));\n\
          })\n\
          .catch(err => {\n\
            ws.send(JSON.stringify({ type: "ssh_connect_error", payload: { error: err.message } }));\n\
          });\n\
        break;\n\
      }\n\
\n\
      case "ssh_exec": {\n\
        const { sshExec } = require("./ssh/ssh_client");\n\
        if (!ws._ssh) {\n\
          ws.send(JSON.stringify({ type: "ssh_error", payload: { error: "Not connected" } }));\n\
          break;\n\
        }\n\
        sshExec(ws._ssh, payload?.command)\n\
          .then(result => {\n\
            ws.send(JSON.stringify({ type: "ssh_exec_result", payload: result }));\n\
          })\n\
          .catch(err => {\n\
            ws.send(JSON.stringify({ type: "ssh_exec_error", payload: { error: err.message } }));\n\
          });\n\
        break;\n\
      }\n\
\n\
      case "ssh_read": {\n\
        const { sshReadFile } = require("./ssh/ssh_client");\n\
        if (!ws._ssh) {\n\
          ws.send(JSON.stringify({ type: "ssh_error", payload: { error: "Not connected" } }));\n\
          break;\n\
        }\n\
        sshReadFile(ws._ssh, payload?.path)\n\
          .then(result => {\n\
            ws.send(JSON.stringify({ type: "ssh_read_result", payload: result }));\n\
          })\n\
          .catch(err => {\n\
            ws.send(JSON.stringify({ type: "ssh_read_error", payload: { error: err.message } }));\n\
          });\n\
        break;\n\
      }\n\
\n\
      case "ssh_write": {\n\
        const { sshWriteFile } = require("./ssh/ssh_client");\n\
        if (!ws._ssh) {\n\
          ws.send(JSON.stringify({ type: "ssh_error", payload: { error: "Not connected" } }));\n\
          break;\n\
        }\n\
        sshWriteFile(ws._ssh, payload?.path, payload?.content ?? "")\n\
          .then(() => {\n\
            ws.send(JSON.stringify({ type: "ssh_write_result", payload: { ok: true } }));\n\
          })\n\
          .catch(err => {\n\
            ws.send(JSON.stringify({ type: "ssh_write_error", payload: { error: err.message } }));\n\
          });\n\
        break;\n\
      }\n\
' backend/server.js

echo "Milestone 2 Step F: SSH Backend installed."
