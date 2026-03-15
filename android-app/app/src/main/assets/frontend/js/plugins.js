window.backend.on("plugin_list_result", ({ list }) => {
  const out = document.getElementById("plugin_list");
  out.innerHTML = list
    .map(p => \`<div>\${p.name}</div>\`)
    .join("");
});

function loadPlugins() {
  backend.send("plugin_list");
}

function runPlugin(path) {
  backend.send("plugin_run", { path });
}

window.backend.on("plugin_run_result", ({ result }) => {
  document.getElementById("plugin_output").innerText =
    JSON.stringify(result, null, 2);
});
