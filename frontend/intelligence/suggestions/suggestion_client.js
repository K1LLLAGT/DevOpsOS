export async function getSuggestions(query) {
  return await fetch("/intelligence/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  }).then(r => r.json());
}
