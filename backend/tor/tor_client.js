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
