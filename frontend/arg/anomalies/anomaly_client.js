export async function requestAnomaly() {
  const res = await fetch("/arg/anomaly").then(r => r.json());
  return res.anomaly || null;
}
