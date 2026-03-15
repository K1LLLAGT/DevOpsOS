export function openPanel(panel, payload) {
  document.dispatchEvent(new CustomEvent("panel.open", {
    detail: { panel, payload }
  }));
}
