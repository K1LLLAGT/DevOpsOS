const https = require("https");
const http = require("http");
const url = require("url");

module.exports = function createNetSandbox(manifest) {
  const allowed = new Set(manifest.permissions.network || []);

  function check(target) {
    const host = url.parse(target).host;
    if (![...allowed].some(a => host.endsWith(a))) {
      throw new Error("Network access denied: " + target);
    }
  }

  return {
    fetch: target => {
      check(target);
      return new Promise((resolve, reject) => {
        const mod = target.startsWith("https") ? https : http;
        mod.get(target, res => {
          let data = "";
          res.on("data", chunk => (data += chunk));
          res.on("end", () => resolve({ status: res.statusCode, data }));
        }).on("error", reject);
      });
    }
  };
};
const { log } = require("./log");
log("net_violation", { target });
