export async function initVerifyPanel() {
  const btn = document.getElementById("verify-run");
  const out = document.getElementById("verify-results");

  btn.onclick = async () => {
    out.innerHTML = "<p>Running...</p>";
    const res = await fetch("/verify/run").then(r => r.json());

    out.innerHTML = "";

    Object.keys(res).forEach(section => {
      const h = document.createElement("h3");
      h.textContent = section;
      out.appendChild(h);

      res[section].forEach(r => {
        const div = document.createElement("div");
        div.className = "verify-item";
        div.textContent = (r.ok ? "✔ " : "✖ ") + r.name;
        div.style.color = r.ok ? "var(--good)" : "var(--bad)";
        out.appendChild(div);
      });
    });
  };
}

// Extend panel to show new sections automatically
// (No overwrite — additive only)

export async function initVerifyPanel() {
  const btn = document.getElementById("verify-run");
  const out = document.getElementById("verify-results");

  btn.onclick = async () => {
    out.innerHTML = "<p>Running...</p>";
    const res = await fetch("/verify/run").then(r => r.json());

    out.innerHTML = "";

    Object.keys(res).forEach(section => {
      const h = document.createElement("h3");
      h.textContent = section;
      out.appendChild(h);

      res[section].forEach(r => {
        const div = document.createElement("div");
        div.className = "verify-item";
        div.textContent = (r.ok ? "✔ " : "✖ ") + r.name;
        div.style.color = r.ok ? "var(--good)" : "var(--bad)";
        out.appendChild(div);
      });
    });
  };
}
