export async function initCluesPanel() {
  const list = document.getElementById("clue-list");
  const res = await fetch("/arg/clues").then(r => r.json());

  res.clues.forEach(c => {
    const div = document.createElement("div");
    div.className = "clue-item";
    div.textContent = c.text;
    list.appendChild(div);
  });
}
