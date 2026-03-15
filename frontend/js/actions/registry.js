let ACTIONS = [];

export async function loadActions() {
  const res = await fetch("/actions/list");
  const data = await res.json();
  ACTIONS = data.actions;
}

export function getActions() {
  return ACTIONS;
}
