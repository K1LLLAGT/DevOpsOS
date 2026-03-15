import { loadActions, getActions } from "../../js/actions/registry.js";
import { executeAction } from "../../js/actions/execute.js";

let CP_OPEN = false;

export async function initCommandPalette() {
  await loadActions();

  const palette = document.getElementById("command-palette");
  const input = document.getElementById("cp-input");

  // Keyboard shortcut: Ctrl+K / Cmd+K
  document.addEventListener("keydown", e => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const mod = isMac ? e.metaKey : e.ctrlKey;

    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      togglePalette();
    }

    if (e.key === "Escape" && CP_OPEN) {
      closePalette();
    }
  });

  function togglePalette() {
    CP_OPEN ? closePalette() : openPalette();
  }

  function openPalette() {
    CP_OPEN = true;
    palette.classList.remove("hidden");
    input.value = "";
    input.focus();
    renderList("");
  }

  function closePalette() {
    CP_OPEN = false;
    palette.classList.add("hidden");
  }

  input.addEventListener("input", () => {
    renderList(input.value.toLowerCase());
  });
}

function renderList(query) {
  const list = document.getElementById("cp-list");
  const actions = getActions();

  const filtered = actions.filter(a =>
    a.title.toLowerCase().includes(query) ||
    a.description.toLowerCase().includes(query) ||
    a.id.toLowerCase().includes(query)
  );

  list.innerHTML = "";

  filtered.forEach(a => {
    const item = document.createElement("div");
    item.className = "cp-item";

    item.innerHTML = \`
      <div class="cp-title">\${a.title}</div>
      <div class="cp-desc">\${a.description}</div>
    \`;

    item.onclick = () => {
      executeAction(a);
      document.getElementById("command-palette").classList.add("hidden");
      CP_OPEN = false;
    };

    list.appendChild(item);
  });
}
import { fuzzyScore } from "./fuzzy.js";

// Patch renderList to use fuzzy scoring
const _renderList = renderList;
renderList = function(query) {
  const list = document.getElementById("cp-list");
  const actions = getActions();

  const scored = actions.map(a => {
    const titleScore = fuzzyScore(query, a.title) * 3;
    const descScore = fuzzyScore(query, a.description);
    const idScore = fuzzyScore(query, a.id) * 0.5;

    return {
      action: a,
      score: titleScore + descScore + idScore
    };
  });

  const filtered = scored
    .filter(s => s.score > -20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  list.innerHTML = "";

  filtered.forEach(({ action }) => {
    const item = document.createElement("div");
    item.className = "cp-item";

    item.innerHTML = \`
      <div class="cp-title">\${action.title}</div>
      <div class="cp-desc">\${action.description}</div>
    \`;

    item.onclick = () => {
      executeAction(action);
      document.getElementById("command-palette").classList.add("hidden");
      CP_OPEN = false;
    };

    list.appendChild(item);
  });
};
import { acronymScore } from "./fuzzy.js";

// Add acronym boost
const __renderList = renderList;
renderList = function(query) {
  const list = document.getElementById("cp-list");
  const actions = getActions();

  const scored = actions.map(a => {
    const titleScore = fuzzyScore(query, a.title) * 3;
    const descScore = fuzzyScore(query, a.description);
    const idScore = fuzzyScore(query, a.id) * 0.5;
    const acroScore = acronymScore(query, a.title);

    return {
      action: a,
      score: titleScore + descScore + idScore + acroScore
    };
  });

  const filtered = scored
    .filter(s => s.score > -20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  list.innerHTML = "";

  filtered.forEach(({ action }) => {
    const item = document.createElement("div");
    item.className = "cp-item";

    item.innerHTML = \`
      <div class="cp-title">\${action.title}</div>
      <div class="cp-desc">\${action.description}</div>
    \`;

    item.onclick = () => {
      executeAction(action);
      document.getElementById("command-palette").classList.add("hidden");
      CP_OPEN = false;
    };

    list.appendChild(item);
  });
};
if (action.source === "plugin") {
  item.classList.add("plugin");
}
