import { startEventStream } from "./event_stream.js";
import { EventBuffer } from "./event_buffer.js";

let FILTER_TYPE = "all";
let FILTER_SOURCE = "all";
let SEARCH = "";

export function initDevTools() {
  const list = document.getElementById("devtools-events");
  const search = document.getElementById("devtools-search");
  const filterType = document.getElementById("devtools-filter-type");
  const filterSource = document.getElementById("devtools-filter-source");

  search.oninput = () => {
    SEARCH = search.value.toLowerCase();
    renderEvents();
  };

  filterType.onchange = () => {
    FILTER_TYPE = filterType.value;
    renderEvents();
  };

  filterSource.onchange = () => {
    FILTER_SOURCE = filterSource.value;
    renderEvents();
  };

  startEventStream(event => {
    EventBuffer.push(event);
    updateFilters(event);
    renderEvents(true);
  });
}

function updateFilters(event) {
  const typeSel = document.getElementById("devtools-filter-type");
  const sourceSel = document.getElementById("devtools-filter-source");

  if (![...typeSel.options].some(o => o.value === event.type)) {
    const opt = document.createElement("option");
    opt.value = event.type;
    opt.innerText = event.type;
    typeSel.appendChild(opt);
  }

  const source = event.plugin || event.source || "system";
  if (![...sourceSel.options].some(o => o.value === source)) {
    const opt = document.createElement("option");
    opt.value = source;
    opt.innerText = source;
    sourceSel.appendChild(opt);
  }
}

function renderEvents(autoScroll = false) {
  const list = document.getElementById("devtools-events");
  list.innerHTML = "";

  EventBuffer.events
    .filter(e => FILTER_TYPE === "all" || e.type === FILTER_TYPE)
    .filter(e => {
      const src = e.plugin || e.source || "system";
      return FILTER_SOURCE === "all" || src === FILTER_SOURCE;
    })
    .filter(e => JSON.stringify(e).toLowerCase().includes(SEARCH))
    .forEach(e => {
      const div = document.createElement("div");
      div.className = "event-item";

      const src = e.plugin || e.source || "system";

      div.innerHTML = \`
        <div class="event-type">\${e.type}</div>
        <div class="event-time">\${new Date(e.time).toLocaleTimeString()} — \${src}</div>
      \`;

      div.onclick = () => inspectEvent(e);

      list.appendChild(div);
    });

  if (autoScroll) {
    list.scrollTop = list.scrollHeight;
  }
}

function inspectEvent(event) {
  document.getElementById("devtools-inspector-content").innerText =
    JSON.stringify(event, null, 2);
}

document.addEventListener("DOMContentLoaded", initDevTools);
async function loadPlugins() {
  const res = await fetch("/devtools/plugins");
  const data = await res.json();
  renderPluginList(data.plugins);
}

function renderPluginList(plugins) {
  const list = document.getElementById("plugin-list");
  list.innerHTML = "";

  plugins.forEach(p => {
    const div = document.createElement("div");
    div.className = "plugin-item";
    div.innerText = p.name;
    div.onclick = () => inspectPlugin(p);
    list.appendChild(div);
  });
}

async function inspectPlugin(plugin) {
  const logs = await fetch("/devtools/plugin_logs?name=" + plugin.name)
    .then(r => r.json())
    .then(d => d.logs);

  const inspector = document.getElementById("plugin-inspector-content");

  inspector.innerText = JSON.stringify({
    name: plugin.name,
    manifest: plugin.manifest,
    actions: plugin.actions,
    tasks: plugin.tasks,
    events: plugin.events,
    logs
  }, null, 2);
}
document.querySelectorAll("#devtools-tabs button").forEach(btn => {
  btn.onclick = () => {
    const tab = btn.dataset.tab;

    document.getElementById("devtools-events").parentElement.classList.toggle("hidden", tab !== "events");
    document.getElementById("devtools-tab-plugins").classList.toggle("hidden", tab !== "plugins");

    if (tab === "plugins") loadPlugins();
  };
});
async function loadRules() {
  const res = await fetch("/devtools/rules");
  const data = await res.json();
  renderRuleList(data.rules);
}

function renderRuleList(rules) {
  const list = document.getElementById("automation-rule-list");
  list.innerHTML = "";

  rules.forEach(r => {
    const div = document.createElement("div");
    div.className = "rule-item";
    div.innerText = r.id;
    div.onclick = () => inspectRule(r);
    list.appendChild(div);
  });
}

async function inspectRule(rule) {
  const logs = await fetch("/devtools/rule_logs?id=" + rule.id)
    .then(r => r.json())
    .then(d => d.logs);

  const inspector = document.getElementById("automation-rule-content");

  inspector.innerText = JSON.stringify({
    rule,
    logs
  }, null, 2);
}
document.querySelectorAll("#devtools-tabs button").forEach(btn => {
  btn.onclick = () => {
    const tab = btn.dataset.tab;

    document.getElementById("devtools-events").parentElement.classList.toggle("hidden", tab !== "events");
    document.getElementById("devtools-tab-plugins").classList.toggle("hidden", tab !== "plugins");
    document.getElementById("devtools-tab-automation").classList.toggle("hidden", tab !== "automation");

    if (tab === "plugins") loadPlugins();
    if (tab === "automation") loadRules();
  };
});
async function loadTasks() {
  const res = await fetch("/devtools/tasks");
  const data = await res.json();
  renderTaskList(data.tasks);
}

function renderTaskList(tasks) {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.innerText = t;
    div.onclick = () => inspectTask(t);
    list.appendChild(div);
  });
}

async function inspectTask(id) {
  const logs = await fetch("/devtools/task_logs?id=" + id)
    .then(r => r.json())
    .then(d => d.logs);

  const inspector = document.getElementById("task-inspector-content");

  inspector.innerText = JSON.stringify({
    id,
    logs
  }, null, 2);
}
document.querySelectorAll("#devtools-tabs button").forEach(btn => {
  btn.onclick = () => {
    const tab = btn.dataset.tab;

    document.getElementById("devtools-events").parentElement.classList.toggle("hidden", tab !== "events");
    document.getElementById("devtools-tab-plugins").classList.toggle("hidden", tab !== "plugins");
    document.getElementById("devtools-tab-automation").classList.toggle("hidden", tab !== "automation");
    document.getElementById("devtools-tab-tasks").classList.toggle("hidden", tab !== "tasks");

    if (tab === "plugins") loadPlugins();
    if (tab === "automation") loadRules();
    if (tab === "tasks") loadTasks();
  };
});
async function loadDevtoolsNotifications() {
  const data = await fetch("/notifications/list").then(r => r.json());
  renderDevtoolsNotifications(data.items);
}

function renderDevtoolsNotifications(items) {
  const list = document.getElementById("devtools-notifications-list");
  list.innerHTML = "";

  items.forEach(n => {
    const div = document.createElement("div");
    div.className = "devtools-notification-item";
    div.innerText = `${n.title} — ${n.level}`;
    div.onclick = () => inspectDevtoolsNotification(n);
    list.appendChild(div);
  });
}

function inspectDevtoolsNotification(n) {
  document.getElementById("devtools-notifications-content").innerText =
    JSON.stringify(n, null, 2);
}
if (tab === "devtools-notifications") loadDevtoolsNotifications();
async function inspectPlugin(plugin) {
  const logs = await fetch("/devtools/plugin_logs?name=" + plugin.name)
    .then(r => r.json())
    .then(d => d.logs);

  const notifications = NOTIFICATIONS.filter(n => n.plugin === plugin.name);

  document.getElementById("plugin-inspector-content").innerText =
    JSON.stringify({
      plugin,
      logs,
      notifications
    }, null, 2);
}
const btn = document.createElement("button");
btn.innerText = "View Notifications";
btn.onclick = () => openPanel("notifications", { plugin: plugin.name });
document.getElementById("plugin-inspector").prepend(btn);
async function inspectRule(rule) {
  const logs = await fetch("/devtools/rule_logs?id=" + rule.id)
    .then(r => r.json())
    .then(d => d.logs);

  const notifications = NOTIFICATIONS.filter(n => n.data?.rule === rule.id);

  document.getElementById("automation-rule-content").innerText =
    JSON.stringify({ rule, logs, notifications }, null, 2);
}
const btn = document.createElement("button");
btn.innerText = "View Notifications";
btn.onclick = () => openPanel("notifications", { rule: rule.id });
document.getElementById("automation-rule-inspector").prepend(btn);
async function inspectTask(id) {
  const logs = await fetch("/devtools/task_logs?id=" + id)
    .then(r => r.json())
    .then(d => d.logs);

  const notifications = NOTIFICATIONS.filter(n => n.data?.task === id);

  document.getElementById("task-inspector-content").innerText =
    JSON.stringify({ id, logs, notifications }, null, 2);
}
const btn = document.createElement("button");
btn.innerText = "View Notifications";
btn.onclick = () => openPanel("notifications", { task: id });
document.getElementById("task-inspector").prepend(btn);
