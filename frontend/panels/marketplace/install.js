export async function installPlugin(id) {
  const res = await fetch("/backend/marketplace/catalog.json");
  const data = await res.json();

  const plugin = data.plugins.find(p => p.id === id);
  if (!plugin) {
    alert("Plugin not found.");
    return;
  }

  const cmd = `devopsos plugin install ${plugin.id}`;
  const output = await window.runCommand(cmd);

  alert(output);
  location.reload();
}
