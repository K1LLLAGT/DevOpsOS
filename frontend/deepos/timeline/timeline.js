export async function initTimeline() {
  const res = await fetch("/deepos/timeline/get").then(r => r.json());
  const list = document.getElementById("timeline-list");
  list.innerHTML = "";

  res.events.forEach(ev => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = \`
      <div class="tl-title">\${ev.title}</div>
      <div class="tl-sub">\${ev.details || ""}</div>
      <div class="tl-ts">\${new Date(ev.ts).toLocaleString()}</div>
    \`;
    list.appendChild(div);
  });
}
