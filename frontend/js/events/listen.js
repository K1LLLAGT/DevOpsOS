import { emitEvent } from "./emit.js";

const listeners = {};

export function onEvent(type, fn) {
  if (!listeners[type]) listeners[type] = [];
  listeners[type].push(fn);
}

export function handleIncomingEvent(event) {
  const list = listeners[event.type] || [];
  list.forEach(fn => fn(event));
}
