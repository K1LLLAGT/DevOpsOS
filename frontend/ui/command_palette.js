import { fuzzyMatch } from "./fuzzy.js";

let COMMANDS = [];
let OPEN = false;

export async function initCommandPalette() {
  COMMANDS = await fetch("/commands/list").then(r => r.json()).then(d => d.commands);

  const input = document.getElementById("cp-input");
  const overlay = document.getElementById("command-palette");

  input.oninput = () => renderResults(input.value);

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      togglePalette();
    }
    if (e.key === "Escape" && OPEN) closePalette();
  });
}

function togglePalette() {
  OPEN ? closePalette() : openPalette();
}

function openPalette() {
  OPEN = true;
  const overlay = document.getElementById("command-palette");
  overlay.classList.remove("hidden");

  const input = document.getElementById("cp-input");
  input.value = "";
  input.focus();

  renderResults("");
}

function closePalette() {
  OPEN = false;
  document.getElementById("command-palette").classList.add("hidden");
}

function renderResults(query) {
  const list = document.getElementById("cp-results");
  list.innerHTML = "";

  const results = fuzzyMatch(COMMANDS, query, c => c.title);

  results.forEach(cmd => {
    const div = document.createElement("div");
    div.className = "cp-item";

    div.innerHTML = \`
      <div class="cp-title">\${cmd.title}</div>
      <div class="cp-category">\${cmd.category}</div>
    \`;

    div.onclick = () => runCommand(cmd.id);

    list.appendChild(div);
  });
}

async function runCommand(id) {
  await fetch("/commands/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  closePalette();
}
import { markUsed } from "./command_recency.js";

async function runCommand(id) {
  markUsed(id);

  await fetch("/commands/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  closePalette();
}
