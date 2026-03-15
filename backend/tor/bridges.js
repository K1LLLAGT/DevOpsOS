const https = require("https");

function fetchBridges() {
  return new Promise((resolve, reject) => {
    https.get("https://bridges.torproject.org/bridges?transport=obfs4", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

module.exports = { fetchBridges };
