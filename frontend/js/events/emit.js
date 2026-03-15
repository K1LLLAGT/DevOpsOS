export async function emitEvent(type, data = {}) {
  await fetch("/events/emit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, data })
  });
}
