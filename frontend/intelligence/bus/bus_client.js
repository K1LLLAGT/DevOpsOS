export async function emitBusEvent(type, payload = {}) {
  await fetch("/intelligence/bus/emit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload })
  });
}
