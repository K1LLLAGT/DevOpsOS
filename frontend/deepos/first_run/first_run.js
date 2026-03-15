export async function checkFirstRun() {
  const res = await fetch("/deepos/first_run/get").then(r => r.json());
  return !res.completed;
}

export async function completeFirstRun() {
  await fetch("/deepos/first_run/complete", { method: "POST" });
}
