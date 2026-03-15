import { PANELS } from "./panels.js";

export function buildNav() {
  const nav = document.getElementById("sidebar-nav");
  nav.innerHTML = "";

  PANELS.forEach(panel => {
    const item = document.createElement("div");
    item.className = "nav-item";
    item.dataset.panel = panel.id;

    item.innerHTML = `
      <span class="material-icons">${panel.icon}</span>
      <span>${panel.title}</span>
    `;

    item.onclick = () => {
      window.loadPanel(panel.id);
    };

    nav.appendChild(item);
  });
}
