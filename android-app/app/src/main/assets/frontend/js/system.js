window.backend.on("system_cpu_result", ({ cpu }) => {
  document.getElementById("cpu_load").innerText =
    cpu.loadavg.join(", ") + " (" + cpu.cores + " cores)";
});

function refreshCPU() {
  backend.send("system_cpu");
}
