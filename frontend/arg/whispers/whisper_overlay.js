import { requestWhisper } from "./whisper_client.js";

let active = false;

export function initWhispers() {
  setInterval(async () => {
    if (active) return;

    const w = await requestWhisper({ panel: window.CURRENT_PANEL });
    if (!w) return;

    active = true;

    const div = document.createElement("div");
    div.className = "whisper-overlay";
    div.textContent = w.text;

    document.body.appendChild(div);

    setTimeout(() => {
      div.remove();
      active = false;
    }, 4000);
  }, 30000); // check every 30s
}
