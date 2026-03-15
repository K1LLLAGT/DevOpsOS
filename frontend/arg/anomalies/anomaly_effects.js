import { requestAnomaly } from "./anomaly_client.js";

export function initAnomalies() {
  setInterval(async () => {
    const a = await requestAnomaly();
    if (!a) return;

    if (a.type === "ui_glitch") {
      document.body.style.filter = "blur(" + a.distortion + "px)";
      setTimeout(() => {
        document.body.style.filter = "";
      }, 300);
    }
  }, 45000); // check every 45s
}
