export async function initLicensePanel() {
  const status = document.getElementById("license-status");

  async function refresh() {
    const res = await fetch("/commercial/license/get").then(r => r.json());
    status.textContent = res.valid ? "Valid License" : "No valid license";
  }

  document.getElementById("license-apply").onclick = async () => {
    const key = document.getElementById("license-key").value;
    const res = await fetch("/commercial/license/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key })
    }).then(r => r.json());

    status.textContent = res.valid ? "Valid License" : "Invalid License";
  };

  refresh();
}
