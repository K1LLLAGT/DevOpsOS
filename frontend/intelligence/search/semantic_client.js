export async function semanticSearch(query) {
  return await fetch("/intelligence/semantic_search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  }).then(r => r.json());
}
