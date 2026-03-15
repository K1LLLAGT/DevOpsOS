export async function embedText(text) {
  return await fetch("/intelligence/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  }).then(r => r.json());
}

export async function semanticSearch(query) {
  return await fetch("/intelligence/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  }).then(r => r.json());
}
