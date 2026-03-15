window.backend.on("process_list_result", ({ list }) => {
  const out = document.getElementById("process_list");
  out.innerHTML = list
    .map(p => \`<div>PID \${p.pid} — \${p.cmd}</div>\`)
    .join("");
});

function refreshProcesses() {
  backend.send("process_list");
}

function killProcess(pid) {
  backend.send("process_kill", { pid });
}
