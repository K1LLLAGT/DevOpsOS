export async function initInstaller() {
  document.getElementById("installer-complete-btn").onclick = async () => {
    await fetch("/installer/complete", { method: "POST" });
  };
}
