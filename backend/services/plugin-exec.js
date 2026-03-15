// plugin-exec.js
const { spawn } = require("child_process");
const path = require("path");

module.exports = function PluginExecutor(ctx) {
  return {
    run(pluginId, args = []) {
      const pluginPath = path.join(
        process.env.HOME,
        ".devopsos/plugins",
        pluginId,
        "main.js"
      );

      const child = spawn("node", [pluginPath, ...args], {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, DEVOPSOS_SANDBOX: "1" }
      });

      child.stdout.on("data", data => {
        ctx.send({
          type: "plugin:output",
          id: pluginId,
          data: data.toString()
        });
      });

      child.stderr.on("data", data => {
        ctx.send({
          type: "plugin:error",
          id: pluginId,
          data: data.toString()
        });
      });

      child.on("exit", code => {
        ctx.send({
          type: "plugin:exit",
          id: pluginId,
          code
        });
      });
    }
  };
};
