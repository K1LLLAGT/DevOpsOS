function torStatus() {
  backend.send("tor_status");
}

window.backend.on("tor_status_result", ({ result }) => {
  document.getElementById("tor_status").innerText = result;
});

function torNewCircuit() {
  backend.send("tor_new_circuit");
}

function torBridges() {
  backend.send("tor_bridges");
}

window.backend.on("tor_bridges_result", ({ bridges }) => {
  document.getElementById("tor_bridges").innerText = bridges;
});
