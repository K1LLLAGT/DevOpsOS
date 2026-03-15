// update.js
const https = require("https");
const fs = require("fs");
const { spawn } = require("child_process");

module.exports = function UpdateService(ctx) {
  return {
    check() {
      ctx.send({
        type: "update:info",
        version: "1.0.0",
        available: true,
        notes: "Milestone‑6 panel integration"
      });
    },

    download(url) {
      const file = fs.createWriteStream("/tmp/devopsos-update.tar.gz");

      https.get(url, res => {
        res.pipe(file);

        file.on("finish", () => {
          file.close();
          ctx.send({ type: "update:downloaded" });
        });
      });
    },

    apply() {
      spawn("tar", ["xf", "/tmp/devopsos-update.tar.gz", "-C", "/"], {
        stdio: "inherit"
      }).on("exit", () => {
        ctx.send({ type: "update:applied" });
        process.exit(0);
      });
    }
  };
};
