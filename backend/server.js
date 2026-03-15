// server.js — DevOps OS Backend Entrypoint (Milestone‑6)

const http = require("http");
const WebSocket = require("ws");

// Router
const routeMessage = require("./ws/router");

// Services
const TerminalService = require("./services/terminal");
const ProcessService = require("./services/process");
const FileService = require("./services/files");
const PluginService = require("./services/plugins");
const SSHService = require("./services/ssh");
const TorService = require("./services/tor");

// New systems
const TorMonitor = require("./services/tor-monitor");
const PluginExecutor = require("./services/plugin-exec");
const SettingsService = require("./services/settings");
const UpdateService = require("./services/update");

// ----------------------------------------
// HTTP + WebSocket Server
// ----------------------------------------

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  // ----------------------------------------
  // Context object passed to all services
  // ----------------------------------------
  const ctx = {
    send(obj) {
      try {
        ws.send(JSON.stringify(obj));
      } catch (err) {
        console.error("WS send error:", err);
      }
    }
  };

  // ----------------------------------------
  // Attach services to context
  // ----------------------------------------
  ctx.terminal = TerminalService(ctx);
  ctx.process = ProcessService(ctx);
  ctx.files = FileService(ctx);
  ctx.plugins = PluginService(ctx);
  ctx.ssh = SSHService(ctx);
  ctx.tor = TorService(ctx);

  // New systems
  ctx.torMonitor = TorMonitor(ctx);
  ctx.pluginExec = PluginExecutor(ctx);
  ctx.settings = SettingsService(ctx);
  ctx.update = UpdateService(ctx);

  // ----------------------------------------
  // WebSocket message handler
  // ----------------------------------------
  ws.on("message", raw => {
    let msg;

    try {
      msg = JSON.parse(raw);
    } catch {
      return ctx.send({
        type: "error",
        code: "INVALID_JSON",
        message: "Malformed JSON"
      });
    }

    routeMessage(msg, ctx);
  });

  ws.on("close", () => {
    // Optional: cleanup per‑connection resources
  });
});

// ----------------------------------------
// Start backend
// ----------------------------------------

server.listen(8080, () => {
  console.log("[DevOpsOS] Backend running on ws://127.0.0.1:8080");
});
const { startAutomationEngine } = require("./automation/engine");
startAutomationEngine();
const startSystemTick = require("./scheduler/tick");
startSystemTick(1000);
const intervalScheduler = require("./scheduler/interval")();
global.IntervalScheduler = intervalScheduler;
const cronScheduler = require("./scheduler/cron")();
global.CronScheduler = cronScheduler;
