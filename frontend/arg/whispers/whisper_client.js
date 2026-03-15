export async function requestWhisper(context = {}) {
  const res = await fetch("/arg/whisper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context })
  }).then(r => r.json());

  return res.whisper || null;
}
