import { startEventStream } from "../devtools/event_stream.js";

let NOTIFICATIONS = [];
let FILTER_LEVEL = "all";
let FILTER_PLUGIN = "all";
let FILTER_CATEGORY = "all";
let SEARCH = "";

export async function initNotifications() {
  const data = await fetch("/notifications/list").then(r => r.json());
  NOTIFICATIONS = data.items;

  setupFilters();
  renderNotifications();

  startEventStream(event => {
    if (event.type === "notification.created") {
      NOTIFICATIONS.push(event);
      updateFilters(event);
      renderNotifications(true);
    }
  });
}

function setupFilters() {
  const search = document.getElementById("notifications-search");
  const level = document.getElementById("notifications-filter-level");
  const plugin = document.getElementById("notifications-filter-plugin");
  const category = document.getElementById("notifications-filter-category");

  search.oninput = () => {
    SEARCH = search.value.toLowerCase();
    renderNotifications();
  };

  level.onchange = () => {
    FILTER_LEVEL = level.value;
    renderNotifications();
  };

  plugin.onchange = () => {
    FILTER_PLUGIN = plugin.value;
    renderNotifications();
  };

  category.onchange = () => {
    FILTER_CATEGORY = category.value;
    renderNotifications();
  };

  NOTIFICATIONS.forEach(updateFilters);
}

function updateFilters(n) {
  const pluginSel = document.getElementById("notifications-filter-plugin");
  const categorySel = document.getElementById("notifications-filter-category");

  if (n.plugin && ![...pluginSel.options].some(o => o.value === n.plugin)) {
    const opt = document.createElement("option");
    opt.value = n.plugin;
    opt.innerText = n.plugin;
    pluginSel.appendChild(opt);
  }

  if (n.data?.category && ![...categorySel.options].some(o => o.value === n.data.category)) {
    const opt = document.createElement("option");
    opt.value = n.data.category;
    opt.innerText = n.data.category;
    categorySel.appendChild(opt);
  }
}

function renderNotifications(autoScroll = false) {
  const list = document.getElementById("notifications-list");
  list.innerHTML = "";

  NOTIFICATIONS
    .filter(n => FILTER_LEVEL === "all" || n.level === FILTER_LEVEL)
    .filter(n => FILTER_PLUGIN === "all" || n.plugin === FILTER_PLUGIN)
    .filter(n => FILTER_CATEGORY === "all" || n.data?.category === FILTER_CATEGORY)
    .filter(n => JSON.stringify(n).toLowerCase().includes(SEARCH))
    .forEach(n => {
      const div = document.createElement("div");
      div.className = "notification-item";

      div.innerHTML = \`
        <div class="notification-title">\${n.title}</div>
        <div class="notification-meta">\${new Date(n.time).toLocaleString()} — \${n.level}</div>
      \`;

      div.onclick = () => inspectNotification(n);

      list.appendChild(div);
    });

  if (autoScroll) {
    list.scrollTop = list.scrollHeight;
  }
}

function inspectNotification(n) {
  document.getElementById("notifications-inspector-content").innerText =
    JSON.stringify(n, null, 2);
}

document.addEventListener("DOMContentLoaded", initNotifications);
