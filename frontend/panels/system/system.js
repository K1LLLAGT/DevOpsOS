let cpuData = [];
let memData = [];
let netData = [];

let cpuChart, memChart, netChart;

async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
}

async function loadSystemData() {
  const [cpu, mem, storage, net] = await Promise.all([
    fetchJSON("/system/cpu"),
    fetchJSON("/system/memory"),
    fetchJSON("/system/storage"),
    fetchJSON("/system/network")
  ]);

  updateCPU(cpu.cpu.usage);
  updateMemory(mem.memory.usage);
  updateStorage(storage.storage);
  updateNetwork(net.network);

  updateHealth(cpu, mem, storage, net);
}

function updateCPU(val) {
  cpuData.push(val);
  if (cpuData.length > 60) cpuData.shift();
  cpuChart.update();
}

function updateMemory(val) {
  memData.push(val);
  if (memData.length > 60) memData.shift();
  memChart.update();
}

function updateStorage(s) {
  const pct = (s.used / s.total) * 100;
  document.getElementById("storage-used").style.width = pct + "%";
  document.getElementById("storage-text").innerText =
    \`\${(s.used/1024/1024).toFixed(1)}GB / \${(s.total/1024/1024).toFixed(1)}GB\`;
}

function updateNetwork(interfaces) {
  const totalRx = interfaces.reduce((a, i) => a + i.rx, 0);
  const totalTx = interfaces.reduce((a, i) => a + i.tx, 0);

  netData.push((totalRx + totalTx) / 1024);
  if (netData.length > 60) netData.shift();

  netChart.update();
}

function updateHealth(cpu, mem, storage, net) {
  const cpuScore = 1 - cpu.cpu.usage;
  const memScore = 1 - mem.memory.usage;
  const storageScore = 1 - (storage.storage.used / storage.storage.total);

  const score = Math.max(0, Math.min(100, Math.round(
    (cpuScore + memScore + storageScore) / 3 * 100
  )));

  document.getElementById("health-score").innerText = score;
}

document.addEventListener("DOMContentLoaded", async () => {
  const prefs = (await fetchJSON("/prefs")).prefs;
  const interval = prefs.system?.refreshInterval || 2000;

  const ctxCPU = document.getElementById("cpu-chart").getContext("2d");
  const ctxMEM = document.getElementById("memory-chart").getContext("2d");
  const ctxNET = document.getElementById("network-chart").getContext("2d");

  cpuChart = new Chart(ctxCPU, {
    type: "line",
    data: { labels: [...Array(60).keys()], datasets: [{ data: cpuData, borderColor: varAccent(), fill: false }] },
    options: { animation: false, scales: { y: { min: 0, max: 1 } } }
  });

  memChart = new Chart(ctxMEM, {
    type: "line",
    data: { labels: [...Array(60).keys()], datasets: [{ data: memData, borderColor: varAccent(), fill: false }] },
    options: { animation: false, scales: { y: { min: 0, max: 1 } } }
  });

  netChart = new Chart(ctxNET, {
    type: "line",
    data: { labels: [...Array(60).keys()], datasets: [{ data: netData, borderColor: varAccent(), fill: false }] },
    options: { animation: false }
  });

  loadSystemData();
  setInterval(loadSystemData, interval);
});

function varAccent() {
  return getComputedStyle(document.documentElement).getPropertyValue("--accent");
}

async function updateHealthScore() {
  const res = await fetch("/system/health");
  const data = await res.json();
  const score = data.score;

  const el = document.getElementById("health-score");
  el.innerText = score;

  if (score > 80) el.style.color = "#39ff14";      // green
  else if (score > 60) el.style.color = "#ffd633"; // yellow
  else if (score > 40) el.style.color = "#ff9933"; // orange
  else el.style.color = "#ff4d4d";                 // red
}


// Inject health score updates into the main refresh loop
document.addEventListener("DOMContentLoaded", async () => {
  const prefs = (await (await fetch("/prefs")).json()).prefs;
  const interval = prefs.system?.refreshInterval || 2000;

  setInterval(() => {
    loadSystemData();
    updateHealthScore();
  }, interval);
});


// Unified refresh function for System Monitor
async function refreshSystem() {
  await loadSystemData();
  await updateHealthScore();
}

// Optional: replace multiple intervals with a single unified loop
document.addEventListener("DOMContentLoaded", async () => {
  const prefs = (await (await fetch("/prefs")).json()).prefs;
  const interval = prefs.system?.refreshInterval || 2000;

  setInterval(refreshSystem, interval);
});

