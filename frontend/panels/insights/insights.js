import { getInsights } from "../../intelligence/insights/insight_client.js";

export async function initInsightsPanel() {
  const list = document.getElementById("insight-list");
  list.innerHTML = "<p>Loading insights...</p>";

  const res = await getInsights();
  list.innerHTML = "";

  res.results.forEach(ins => {
    const div = document.createElement("div");
    div.className = "insight-item";
    div.innerHTML = \`
      <div class="ins-title">\${ins.title}</div>
      <div class="ins-sub">\${ins.subtitle}</div>
      <div class="ins-cat">\${ins.category}</div>
    \`;
    div.onclick = () => {
      window.dispatchEvent(new CustomEvent("frontend-command", {
        detail: {
          id: ins.action,
          payload: ins.payload
        }
      }));
    };
    list.appendChild(div);
  });
}
