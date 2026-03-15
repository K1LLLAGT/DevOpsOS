export async function initCrashlogPanel() {
  const list = document.getElementById("crashlog-list");
  list.innerHTML = "<p>Loading...</p>";

  const res = await fetch("/commercial/crashlog/list").then(r => r.json());
  list.innerHTML = "";

  res.crashes.forEach(c => {
    const div = document.createElement("div");
    div.className = "crash-item";
    div.innerHTML = \`
      <div class="crash-error">\${c.error}</div>
      <div class="crash-ts">\${new Date(c.ts).toLocaleString()}</div>
    \`;
    list.appendChild(div);
  });
}
