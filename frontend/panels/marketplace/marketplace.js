export async function initMarketplacePanel() {
  const list = document.getElementById("marketplace-list");
  list.innerHTML = "<p>Loading...</p>";

  const res = await fetch("/commercial/marketplace/list").then(r => r.json());
  list.innerHTML = "";

  res.plugins.forEach(p => {
    const div = document.createElement("div");
    div.className = "mp-item";
    div.innerHTML = \`
      <div class="mp-title">\${p.name}</div>
      <div class="mp-sub">v\${p.version}</div>
      <button class="mp-buy">Buy</button>
    \`;

    div.querySelector(".mp-buy").onclick = async () => {
      await fetch("/commercial/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pluginId: p.id })
      });
      alert("Purchased " + p.name);
    };

    list.appendChild(div);
  });
}
