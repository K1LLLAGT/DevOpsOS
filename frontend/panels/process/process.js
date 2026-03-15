let PROCESS_LIST = [];
let PROCESS_SORT = "cpu";
let PROCESS_FILTER = "";
let PROCESS_TREE = false;

async function fetchProcesses() {
  const res = await fetch("/system/processes");
  const data = await res.json();
  PROCESS_LIST = data.processes || [];
  renderProcesses();
}

function renderProcesses() {
  let list = [...PROCESS_LIST];

  // Filter
  if (PROCESS_FILTER) {
    list = list.filter(p =>
      p.cmd.toLowerCase().includes(PROCESS_FILTER.toLowerCase())
    );
  }

  // Sort
  list.sort((a, b) => {
    switch (PROCESS_SORT) {
      case "cpu": return b.cpu - a.cpu;
      case "mem": return b.mem - a.mem;
      case "pid": return a.pid - b.pid;
      case "name": return a.cmd.localeCompare(b.cmd);
    }
  });

  // Tree mode
  if (PROCESS_TREE) {
    list = buildProcessTree(list);
  }

  const body = document.getElementById("process-body");
  body.innerHTML = "";

  list.forEach(p => {
    const row = document.createElement("tr");

    row.innerHTML = \`
      <td>\${p.pid}</td>
      <td>\${p.ppid}</td>
      <td>\${"&nbsp;".repeat(p.depth || 0 * 4)}\${p.cmd}</td>
      <td>\${p.cpu.toFixed(1)}</td>
      <td>\${p.mem.toFixed(1)}</td>
      <td><button class="kill-btn" data-pid="\${p.pid}">Kill</button></td>
    \`;

    body.appendChild(row);
  });

  document.querySelectorAll(".kill-btn").forEach(btn => {
    btn.onclick = () => killProcess(btn.dataset.pid);
  });
}

async function killProcess(pid) {
  await fetch("/system/kill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pid })
  });
  fetchProcesses();
}

function buildProcessTree(list) {
  const map = {};
  list.forEach(p => map[p.pid] = { ...p, children: [] });

  const roots = [];

  list.forEach(p => {
    if (map[p.ppid]) {
      map[p.ppid].children.push(map[p.pid]);
    } else {
      roots.push(map[p.pid]);
    }
  });

  const result = [];
  function walk(node, depth = 0) {
    result.push({ ...node, depth });
    node.children.forEach(c => walk(c, depth + 1));
  }

  roots.forEach(r => walk(r));
  return result;
}

document.addEventListener("DOMContentLoaded", async () => {
  const prefs = (await (await fetch("/prefs")).json()).prefs;

  PROCESS_SORT = prefs.process?.sort || "cpu";
  PROCESS_TREE = prefs.process?.tree || false;

  document.getElementById("process-sort").value = PROCESS_SORT;
  document.getElementById("process-tree").checked = PROCESS_TREE;

  document.getElementById("process-sort").onchange = e => {
    PROCESS_SORT = e.target.value;
    saveProcessPrefs();
    renderProcesses();
  };

  document.getElementById("process-search").oninput = e => {
    PROCESS_FILTER = e.target.value;
    renderProcesses();
  };

  document.getElementById("process-tree").onchange = e => {
    PROCESS_TREE = e.target.checked;
    saveProcessPrefs();
    renderProcesses();
  };

  fetchProcesses();
  setInterval(fetchProcesses, prefs.system?.refreshInterval || 2000);
});

async function saveProcessPrefs() {
  await fetch("/prefs/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      process: {
        sort: PROCESS_SORT,
        tree: PROCESS_TREE
      }
    })
  });
}
