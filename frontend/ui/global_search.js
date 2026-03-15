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

// Semantic search integration
async function queryGlobalSearch(q) {
  if (!q.trim()) {
    renderGlobalResults([]);
    return;
  }

  const res = await fetch("/intelligence/semantic_search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q })
  }).then(r => r.json());

  GS_RESULTS = res.results || [];
  GS_INDEX = GS_RESULTS.length ? 0 : -1;
  renderGlobalResults(GS_RESULTS);
}

// Suggestion injection
async function queryGlobalSearch(q) {
  if (!q.trim()) {
    renderGlobalResults([]);
    return;
  }

  const [semantic, suggestions] = await Promise.all([
    fetch("/intelligence/semantic_search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q })
    }).then(r => r.json()),

    fetch("/intelligence/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q })
    }).then(r => r.json())
  ]);

  GS_RESULTS = [
    ...suggestions.results.map(r => ({ ...r, category: "Suggestion" })),
    ...semantic.results
  ];

  GS_INDEX = GS_RESULTS.length ? 0 : -1;
  renderGlobalResults(GS_RESULTS);
}
