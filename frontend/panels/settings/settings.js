let SETTINGS = {};
let CURRENT_KEY = null;

export async function initSettingsPanel() {
  const data = await fetch("/settings/get").then(r => r.json());
  SETTINGS = data.values || {};
  renderSettingsList(data);
  wireSettingsEditor();
}

function renderSettingsList(data) {
  const list = document.getElementById("settings-list");
  list.innerHTML = "";

  const addItem = (key, desc) => {
    const div = document.createElement("div");
    div.className = "setting-item";
    div.innerText = key + (desc ? " — " + desc : "");
    div.onclick = () => selectSetting(key, desc);
    list.appendChild(div);
  };

  const global = data.globalSchema || {};
  Object.keys(global).forEach(k => addItem(k, global[k].description));

  const plugins = data.pluginSchemas || {};
  Object.keys(plugins).forEach(p => {
    Object.keys(plugins[p]).forEach(k => {
      addItem(`${p}.${k}`, plugins[p][k].description);
    });
  });
}

function wireSettingsEditor() {
  document.getElementById("settings-save-btn").onclick = async () => {
    if (!CURRENT_KEY) return;
    const value = document.getElementById("settings-value-input").value;
    await fetch("/settings/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: CURRENT_KEY, value })
    });
  };
}

function selectSetting(key, desc) {
  CURRENT_KEY = key;
  document.getElementById("settings-key-title").innerText = key;
  document.getElementById("settings-value-input").value = SETTINGS[key] ?? "";
}
