// backend/system/cpu.js
const os = require("os");

function getCPU() {
  return {
    loadavg: os.loadavg(),
    cores: os.cpus().length
  };
}

module.exports = { getCPU };
