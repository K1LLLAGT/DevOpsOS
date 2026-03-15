export async function initGitPanel() {
  const statusEl = document.getElementById("git-status");
  const diffEl = document.getElementById("git-diff");

  async function refresh() {
    const s = await fetch("/devpower/git/status").then(r => r.json());
    const d = await fetch("/devpower/git/diff").then(r => r.json());
    statusEl.textContent = s.status;
    diffEl.textContent = d.diff;
  }

  document.getElementById("git-refresh").onclick = refresh;

  document.getElementById("git-commit-btn").onclick = async () => {
    const msg = document.getElementById("git-commit-msg").value;
    await fetch("/devpower/git/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg })
    });
    refresh();
  };

  document.getElementById("git-push-btn").onclick = async () => {
    await fetch("/devpower/git/push", { method: "POST" });
    refresh();
  };

  refresh();
}
