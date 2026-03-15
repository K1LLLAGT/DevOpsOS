export async function getInsights() {
  return await fetch("/intelligence/insights").then(r => r.json());
}
