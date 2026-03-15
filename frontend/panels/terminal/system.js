/* system.js */

import { on } from "../../js/core/events.js";

export function init() {
  on("system:stats", updateStats);
}

export function unload() {}

function updateStats(stats) {
  document.querySelector("#cpu").textContent = stats.cpu;
  document.querySelector("#ram").textContent = stats.ram;
  document.querySelector("#disk").textContent = stats.disk;
}
