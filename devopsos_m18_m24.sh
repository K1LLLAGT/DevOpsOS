#!/usr/bin/env bash
set -euo pipefail

root="$(pwd)"

echo "[DevOpsOS] Milestones 18–24 bootstrap starting..."

###############################################################################
# MILESTONE 18 — GLOBAL SEARCH UI (SPOTLIGHT OVERLAY)
###############################################################################

mkdir -p frontend/ui

cat << 'EOT' > frontend/ui/global_search.html
<div id="global-search-overlay" class="hidden">
  <div id="gs-container">
    <input id="gs-input" placeholder="Search everything...">
    <div id="gs-results"></div>
  </div>
</div>
EOT

cat << 'EOT' > frontend/ui/global_search.css
#global-search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  z-index: 10000;
}

#gs-container {
  width: 720px;
  background: var(--panel-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 6px 28px rgba(0,0,0,0.5);
}

#gs-input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  margin-bottom: 12px;
}

#gs-results {
  max-height: 480px;
  overflow-y: auto;
}

.gs-item {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}

.gs-item:hover,
.gs-item.gs-selected {
  background: var(--hover);
}

.gs-title {
  font-weight: bold;
}

.gs-subtitle {
  opacity: 0.7;
  font-size: 12px;
}

.gs-category {
  opacity: 0.6;
  font-size: 11px;
  text-transform: uppercase;
}
EOT

cat << 'EOT' > frontend/ui/global_search.js
import { dispatchFrontendCommand } from "../js/core/command_dispatcher.js";

let GS_RESULTS = [];
let GS_OPEN = false;
let GS_INDEX = -1;

export function initGlobalSearch() {
  const overlay = document.getElementById("global-search-overlay");
  const input = document.getElementById("gs-input");

  document.body.appendChild(overlay);

  input.oninput = () => queryGlobalSearch(input.value);

  document.addEventListener("keydown", e => {
    // Ctrl+Space / Cmd+Space
    if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
      e.preventDefault();
      toggleGlobalSearch();
    }

    if (!GS_OPEN) return;

    if (e.key === "Escape") {
      closeGlobalSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveSelection(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveSelection(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      activateSelection();
    }
  });
}

function toggleGlobalSearch() {
  GS_OPEN ? closeGlobalSearch() : openGlobalSearch();
}

function openGlobalSearch() {
  GS_OPEN = true;
  GS_INDEX = -1;
  const overlay = document.getElementById("global-search-overlay");
  overlay.classList.remove("hidden");
  const input = document.getElementById("gs-input");
  input.value = "";
  input.focus();
  renderGlobalResults([]);
}

function closeGlobalSearch() {
  GS_OPEN = false;
  const overlay = document.getElementById("global-search-overlay");
  overlay.classList.add("hidden");
}

async function queryGlobalSearch(q) {
  if (!q.trim()) {
    renderGlobalResults([]);
    return;
  }

  const res = await fetch("/search/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q })
  }).then(r => r.json());

  GS_RESULTS = res.results || [];
  GS_INDEX = GS_RESULTS.length ? 0 : -1;
  renderGlobalResults(GS_RESULTS);
}

function renderGlobalResults(items) {
  const list = document.getElementById("gs-results");
  list.innerHTML = "";

  items.forEach((r, idx) => {
    const div = document.createElement("div");
    div.className = "gs-item" + (idx === GS_INDEX ? " gs-selected" : "");
    div.innerHTML = `
      <div class="gs-title">${r.title}</div>
      <div class="gs-subtitle">${r.subtitle || ""}</div>
      <div class="gs-category">${r.category || ""}</div>
    `;
    div.onclick = () => runGlobalResult(r);
    list.appendChild(div);
  });
}

function moveSelection(delta) {
  if (!GS_RESULTS.length) return;
  GS_INDEX = (GS_INDEX + delta + GS_RESULTS.length) % GS_RESULTS.length;
  renderGlobalResults(GS_RESULTS);
}

function activateSelection() {
  if (GS_INDEX < 0 || GS_INDEX >= GS_RESULTS.length) return;
  runGlobalResult(GS_RESULTS[GS_INDEX]);
}

async function runGlobalResult(r) {
  // Try frontend command first
  const cmd = { id: r.action, payload: r.payload || {}, category: r.category, plugin: r.plugin };
  const handled = dispatchFrontendCommand(cmd);
  if (!handled) {
    await fetch("/commands/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.action, payload: r.payload || {} })
    });
  }
  closeGlobalSearch();
}
EOT

###############################################################################
# MILESTONE 19 — SETTINGS SYSTEM + SCHEMA REGISTRY
###############################################################################

mkdir -p backend/settings

cat << 'EOT' > backend/settings/schema_registry.js
const pluginSchemas = {};

let globalSchema = {
  "theme": { type: "string", description: "Active theme name" },
  "telemetry.enabled": { type: "boolean", description: "Enable anonymous telemetry" }
};

module.exports = {
  pluginSchemas,
  getGlobalSchema() {
    return globalSchema;
  },
  registerGlobalSchema(schema) {
    globalSchema = { ...globalSchema, ...schema };
  },
  registerPluginSchema(plugin, schema) {
    pluginSchemas[plugin] = { ...(pluginSchemas[plugin] || {}), ...schema };
  }
};
EOT

cat << 'EOT' > backend/settings/storage.js
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "settings.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
EOT

mkdir -p backend/routes/settings

cat << 'EOT' > backend/routes/settings/get.js
const storage = require("../../settings/storage");
const schema = require("../../settings/schema_registry");

module.exports = (req, res) => {
  const values = storage.load();
  res.json({
    values,
    globalSchema: schema.getGlobalSchema(),
    pluginSchemas: schema.pluginSchemas
  });
};
EOT

cat << 'EOT' > backend/routes/settings/set.js
const storage = require("../../settings/storage");

module.exports = (req, res) => {
  const { key, value } = req.body;
  const current = storage.load();
  current[key] = value;
  storage.save(current);
  res.json({ ok: true });
};
EOT

cat << 'EOT' >> backend/routes/index.js
router.get("/settings/get", require("./settings/get"));
router.post("/settings/set", require("./settings/set"));
EOT

mkdir -p frontend/panels/settings

cat << 'EOT' > frontend/panels/settings/settings.html
<div id="settings-panel">
  <div id="settings-list"></div>
  <div id="settings-editor">
    <h3 id="settings-key-title">Select a setting...</h3>
    <input id="settings-value-input">
    <button id="settings-save-btn">Save</button>
  </div>
</div>
EOT

cat << 'EOT' > frontend/panels/settings/settings.css
#settings-panel {
  display: flex;
  gap: 12px;
  height: 100%;
  padding: 12px;
}

#settings-list {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow-y: auto;
  background: var(--panel-bg);
}

#settings-editor {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px;
  background: var(--panel-bg);
}
.setting-item {
  padding: 8px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.setting-item:hover {
  background: var(--hover);
}
EOT

cat << 'EOT' > frontend/panels/settings/settings.js
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
EOT

cat << 'EOT' >> frontend/js/core/panels.js
PANELS["settings"] = {
  name: "Settings",
  path: "panels/settings/settings.html",
  script: "panels/settings/settings.js",
  style: "panels/settings/settings.css"
};
EOT

###############################################################################
# MILESTONE 20 — THEME ENGINE + DARK MODE + CUSTOM THEMES
###############################################################################

mkdir -p frontend/themes

cat << 'EOT' > frontend/themes/default.css
:root {
  --bg: #111827;
  --panel-bg: #020617;
  --border: #1f2937;
  --hover: #111827;
  --text: #e5e7eb;
}
EOT

cat << 'EOT' > frontend/themes/light.css
:root {
  --bg: #f9fafb;
  --panel-bg: #ffffff;
  --border: #d1d5db;
  --hover: #e5e7eb;
  --text: #111827;
}
EOT

cat << 'EOT' > frontend/js/core/theme.js
export function applyTheme(name) {
  const linkId = "devopsos-theme-link";
  let link = document.getElementById(linkId);
  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = "themes/" + name + ".css";
}
EOT

###############################################################################
# MILESTONE 21 — USER PROFILES + SYNC (SKELETON)
###############################################################################

mkdir -p backend/profiles

cat << 'EOT' > backend/profiles/storage.js
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "data", "profiles.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { active: "default", profiles: { "default": {} } };
  }
}

function save(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
EOT

mkdir -p backend/routes/profiles

cat << 'EOT' > backend/routes/profiles/get.js
const storage = require("../../profiles/storage");

module.exports = (req, res) => {
  res.json(storage.load());
};
EOT

cat << 'EOT' > backend/routes/profiles/set_active.js
const storage = require("../../profiles/storage");

module.exports = (req, res) => {
  const { name } = req.body;
  const data = storage.load();
  if (!data.profiles[name]) data.profiles[name] = {};
  data.active = name;
  storage.save(data);
  res.json({ ok: true });
};
EOT

cat << 'EOT' >> backend/routes/index.js
router.get("/profiles/get", require("./profiles/get"));
router.post("/profiles/set_active", require("./profiles/set_active"));
EOT

###############################################################################
# MILESTONE 22 — UPDATE SYSTEM (CHANNELS SKELETON)
###############################################################################

mkdir -p backend/update

cat << 'EOT' > backend/update/state.js
let channel = "stable";
let latestVersion = "0.0.1";
let currentVersion = "0.0.1";

module.exports = {
  getState() {
    return { channel, latestVersion, currentVersion };
  },
  setChannel(c) {
    channel = c;
  }
};
EOT

mkdir -p backend/routes/update

cat << 'EOT' > backend/routes/update/get.js
const state = require("../../update/state");

module.exports = (req, res) => {
  res.json(state.getState());
};
EOT

cat << 'EOT' > backend/routes/update/channel.js
const state = require("../../update/state");

module.exports = (req, res) => {
  const { channel } = req.body;
  state.setChannel(channel);
  res.json({ ok: true });
};
EOT

cat << 'EOT' >> backend/routes/index.js
router.get("/update/get", require("./update/get"));
router.post("/update/channel", require("./update/channel"));
EOT

###############################################################################
# MILESTONE 23 — INSTALLER + FIRST-RUN EXPERIENCE (SKELETON)
###############################################################################

mkdir -p backend/installer

cat << 'EOT' > backend/installer/state.js
let completed = false;

module.exports = {
  isCompleted() {
    return completed;
  },
  complete() {
    completed = true;
  }
};
EOT

mkdir -p backend/routes/installer

cat << 'EOT' > backend/routes/installer/status.js
const state = require("../../installer/state");

module.exports = (req, res) => {
  res.json({ completed: state.isCompleted() });
};
EOT

cat << 'EOT' > backend/routes/installer/complete.js
const state = require("../../installer/state");

module.exports = (req, res) => {
  state.complete();
  res.json({ ok: true });
};
EOT

cat << 'EOT' >> backend/routes/index.js
router.get("/installer/status", require("./installer/status"));
router.post("/installer/complete", require("./installer/complete"));
EOT

mkdir -p frontend/panels/installer

cat << 'EOT' > frontend/panels/installer/installer.html
<div id="installer">
  <h2>Welcome to DevOpsOS</h2>
  <p>Initial setup is required.</p>
  <button id="installer-complete-btn">Finish Setup</button>
</div>
EOT

cat << 'EOT' > frontend/panels/installer/installer.css
#installer {
  padding: 20px;
}
EOT

cat << 'EOT' > frontend/panels/installer/installer.js
export async function initInstaller() {
  document.getElementById("installer-complete-btn").onclick = async () => {
    await fetch("/installer/complete", { method: "POST" });
  };
}
EOT

cat << 'EOT' >> frontend/js/core/panels.js
PANELS["installer"] = {
  name: "Installer",
  path: "panels/installer/installer.html",
  script: "panels/installer/installer.js",
  style: "panels/installer/installer.css"
};
EOT

###############################################################################
# MILESTONE 24 — PACKAGING, SIGNING, RELEASE PIPELINE (SKELETON)
###############################################################################

mkdir -p tools/release

cat << 'EOT' > tools/release/build_android.sh
#!/usr/bin/env bash
set -euo pipefail
echo "[DevOpsOS] Building Android APK (placeholder)..."
# ./gradlew assembleRelease
EOT

cat << 'EOT' > tools/release/sign_android.sh
#!/usr/bin/env bash
set -euo pipefail
echo "[DevOpsOS] Signing Android APK (placeholder)..."
# jarsigner / apksigner commands go here
EOT

cat << 'EOT' > tools/release/publish.sh
#!/usr/bin/env bash
set -euo pipefail
echo "[DevOpsOS] Publishing release (placeholder)..."
# Upload to store / internal channel
EOT

chmod +x tools/release/*.sh

echo "[DevOpsOS] Milestones 18–24 skeleton applied."
