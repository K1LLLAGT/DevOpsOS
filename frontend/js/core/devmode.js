async function applyDeveloperMode() {
  const res = await fetch("/prefs");
  const prefs = (await res.json()).prefs;

  const enabled = prefs.developer?.enabled;

  document.querySelectorAll(".dev-only").forEach(el => {
    el.style.display = enabled ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", applyDeveloperMode);
window.applyDeveloperMode = applyDeveloperMode;
