export async function getPluginSettings(plugin) {
  const res = await fetch("/settings/get");
  const data = await res.json();
  return data.plugins[plugin] || {};
}

export async function setPluginSetting(plugin, key, value) {
  await fetch("/settings/set_plugin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plugin, key, value })
  });
}
