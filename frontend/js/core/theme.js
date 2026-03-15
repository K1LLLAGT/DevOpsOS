export function applyTheme(name) {
  const linkId = "devopsos-theme-link";
  let link = document.getElementById(linkId);
  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = "themes/" + name + ".css";
}
