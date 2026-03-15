const { spawn } = require("child_process");

const servers = {
  ts: { cmd: "typescript-language-server", args: ["--stdio"] },
  py: { cmd: "pylsp", args: [] },
  go: { cmd: "gopls", args: [] },
  rs: { cmd: "rust-analyzer", args: [] }
};

const instances = {};

function startServer(lang) {
  if (instances[lang]) return instances[lang];

  const cfg = servers[lang];
  if (!cfg) throw new Error("No LSP for " + lang);

  const proc = spawn(cfg.cmd, cfg.args, { stdio: "pipe" });
  instances[lang] = proc;

  proc.on("exit", () => {
    delete instances[lang];
  });

  return proc;
}

function send(lang, msg) {
  const proc = startServer(lang);
  const json = JSON.stringify(msg);
  const header = "Content-Length: " + Buffer.byteLength(json) + "\r\n\r\n";
  proc.stdin.write(header + json);
}

function onMessage(lang, cb) {
  const proc = startServer(lang);
  let buffer = "";

  proc.stdout.on("data", chunk => {
    buffer += chunk.toString();
    const idx = buffer.indexOf("\r\n\r\n");
    if (idx !== -1) {
      const header = buffer.slice(0, idx);
      const rest = buffer.slice(idx + 4);
      const match = header.match(/Content-Length: (\d+)/);
      if (match) {
        const len = parseInt(match[1], 10);
        const body = rest.slice(0, len);
        buffer = rest.slice(len);
        try {
          cb(JSON.parse(body));
        } catch {}
      }
    }
  });
}

module.exports = { startServer, send, onMessage };
