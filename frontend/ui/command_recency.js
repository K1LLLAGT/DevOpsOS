let RECENT = {};

export function markUsed(id) {
  RECENT[id] = Date.now();
}

export function getRecency(id) {
  return RECENT[id] || 0;
}
