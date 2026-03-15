let PLUGINS = [];

async function loadPlugins() {
  const res = await fetch("/plugins/list");
  PLUGINS = (await res.json()).plugins;
  renderPlugins();
}

function riskLevel(plugin) {
  const perms = plugin.manifest.permissions;
  const caps = plugin.manifest.capabilities;

  let score = 0;

  if (perms.filesystem?.length) score += 2;
  if (perms.network?.length) score += 2;
  if (perms.system?.length) score += 3;

  if (caps.includes("system.info")) score += 1;
  if (caps.includes("storage.write")) score += 1;

  if (score <= 2) return "low";
  if (score <= 5) return "med";
  return "high";
}

function renderPlugins() {
  const list = document.getElementById("plugin-list");
  list.innerHTML = "";

  PLUGINS.forEach(plugin => {
    const risk = riskLevel(plugin);

    const card = document.createElement("div");
    card.className = "plugin-card";

    card.innerHTML = \`
      <div class="plugin-header">
        <div class="plugin-name">\${plugin.manifest.name} <span style="opacity:0.6">v\${plugin.manifest.version}</span></div>
        <div class="plugin-risk risk-\${risk}">\${risk.toUpperCase()}</div>
      </div>

      <p>Capabilities: \${plugin.manifest.capabilities.join(", ")}</p>

      <div class="plugin-actions">
        <button class="review-btn" data-name="\${plugin.manifest.name}">Review Permissions</button>
        <button class="toggle-btn" data-name="\${plugin.manifest.name}">
          \${plugin.enabled ? "Disable" : "Enable"}
        </button>
      </div>
    \`;

    list.appendChild(card);
  });

  document.querySelectorAll(".review-btn").forEach(btn => {
    btn.onclick = () => openReviewModal(btn.dataset.name);
  });

  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.onclick = () => togglePlugin(btn.dataset.name);
  });
}

function openReviewModal(name) {
  const plugin = PLUGINS.find(p => p.manifest.name === name);

  document.getElementById("plugin-modal-title").innerText = plugin.manifest.name;
  document.getElementById("plugin-modal-body").innerText =
    JSON.stringify(plugin.manifest, null, 2);

  document.getElementById("plugin-modal").classList.remove("hidden");
}

async function togglePlugin(name) {
  await fetch("/plugins/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  loadPlugins();
}

document.addEventListener("DOMContentLoaded", () => {
  loadPlugins();

  document.getElementById("plugin-modal-close").onclick = () => {
    document.getElementById("plugin-modal").classList.add("hidden");
  };
});
