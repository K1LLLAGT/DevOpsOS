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
