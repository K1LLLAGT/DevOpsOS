export async function initUnlockPanel() {
  const status = document.getElementById("unlock-status");

  async function refresh() {
    const res = await fetch("/arg/unlock/state").then(r => r.json());
    status.textContent = res.unlocked
      ? "Unlocked"
      : "Progress: " + res.progress.length + " fragments";
  }

  document.getElementById("unlock-submit").onclick = async () => {
    const text = document.getElementById("unlock-input").value;
    await fetch("/arg/unlock/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    refresh();
  };

  refresh();
}
