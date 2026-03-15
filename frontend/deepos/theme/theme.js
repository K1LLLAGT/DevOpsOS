export async function loadThemes() {
  const res = await fetch("/deepos/themes").then(r => r.json());
  return res.themes || [];
}

export function applyTheme(name) {
  let link = document.getElementById("devopsos-theme");
  if (!link) {
    link = document.createElement("link");
    link.id = "devopsos-theme";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = "themes/" + name + ".css";
}
