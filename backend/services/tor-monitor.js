// tor-monitor.js
const { spawn } = require("child_process");
const net = require("net");

module.exports = function TorMonitor(ctx) {
  let torProc = null;
  let control = null;

  function startTor() {
    if (torProc) return;

    torProc = spawn("tor", ["--ControlPort", "9051"], {
      stdio: "ignore"
    });

    ctx.send({ type: "tor:status", status: "starting" });

    setTimeout(connectControlPort, 3000);
  }

  function connectControlPort() {
    control = net.connect(9051, "127.0.0.1", () => {
      ctx.send({ type: "tor:status", status: "connected" });
      control.write('AUTHENTICATE ""\r\n');
      control.write("GETINFO circuit-status\r\n");
    });

    control.on("data", data => {
      ctx.send({
        type: "tor:circuit",
        text: data.toString()
      });
    });

    control.on("error", () => {
      ctx.send({ type: "tor:status", status: "error" });
    });
  }

  function stopTor() {
    if (torProc) torProc.kill("SIGTERM");
    torProc = null;
    ctx.send({ type: "tor:status", status: "stopped" });
  }

  return {
    startTor,
    stopTor,
    connectControlPort
  };
};
